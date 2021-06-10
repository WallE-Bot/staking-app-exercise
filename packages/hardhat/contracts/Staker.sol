pragma solidity >=0.6.0 <=0.8.0;

import "hardhat/console.sol";
import "./ExampleExternalContract.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract Staker {

  ExampleExternalContract public exampleExternalContract;
  mapping(address => uint256) public balances;
  event Stake(address, uint256);
  uint256 public constant threshold = 1 wei;
  uint256 public deadline = now + 30 seconds;
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
  function withdraw() public notCompleted {
    require(timeLeft() <= 0, "Time still remaining to meet staking treshold");
    require(balances[msg.sender] > 0, "address balance is 0");

    // allow withdrawal
    uint balance = balances[msg.sender];
    balances[msg.sender] = 0;
    msg.sender.transfer(balance);
  }

  // Add a `timeLeft()` view function that returns the time left before the deadline for the frontend
  function timeLeft() public view returns (uint256) {
    return now >= deadline ? 0 : deadline - now;
  }

}
