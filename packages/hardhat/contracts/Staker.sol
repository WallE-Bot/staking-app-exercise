pragma solidity >=0.6.0 <=0.8.0;

import "hardhat/console.sol";
import "./ExampleExternalContract.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract Staker {

  ExampleExternalContract public exampleExternalContract;
  mapping(address => uint256) public balances;
  event Stake(address, uint256);
  uint256 public constant threshold = 10 ether;
  uint256 public deadline = now + 10 minutes;
  string public executionFeedback = '';

  constructor(address exampleExternalContractAddress) public {
    exampleExternalContract = ExampleExternalContract(exampleExternalContractAddress);
  }

  modifier withinDeadline {
    require(timeLeft() > 0, 'time ran out');
    _;
  }

  modifier notCompleted {
    require(!exampleExternalContract.completed(), 'ExampleExternalContract already completed');
    _;
  }

  // Collect funds in a payable `stake()` function and track individual `balances` with a mapping:
  //  ( make sure to add a `Stake(address,uint256)` event and emit it for the frontend <List/> display )
  function stake(uint amount) external payable withinDeadline {
    balances[msg.sender] += amount;
    emit Stake(msg.sender, amount);
  }

  // After some `deadline` allow anyone to call an `execute()` function
  //  It should either call `exampleExternalContract.complete{value: address(this).balance}()` to send all the value
  function execute() public notCompleted {
    if (timeLeft() <= 0) {
      executionFeedback = "time ran out";
    } else { // determine if treshold met
      if (address(this).balance >= threshold) {
        exampleExternalContract.complete{value: address(this).balance}();
      } else {
        executionFeedback = "amount staked threshold not met";
      }
    }
  }

  // if the `threshold` was not met, allow everyone to call a `withdraw()` function
  // modify for specific withdrawal amount
  function withdraw(uint256 amount) public notCompleted {
    uint balance = balances[msg.sender];
    console.log(amount, balance);
    require(balance > 0 && balance >= amount, "address balance insufficient");

    // allow withdrawal
    balances[msg.sender] = 0;
    msg.sender.transfer(balance);
  }

  // Add a `timeLeft()` view function that returns the time left before the deadline for the frontend
  function timeLeft() public view returns (uint256) {
    return now >= deadline ? 0 : deadline - now;
  }

}
