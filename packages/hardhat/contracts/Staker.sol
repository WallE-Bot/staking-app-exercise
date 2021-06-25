pragma solidity >=0.6.0 <=0.8.0;

import "hardhat/console.sol";
import "./ExampleExternalContract.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract Staker {

  ExampleExternalContract public exampleExternalContract;
  mapping(address => uint256) public balances;
  event Stake(address, uint256);
  uint256 public constant threshold = 10 ether;
  uint256 public deadline = now + 10 minutes;

  constructor(address exampleExternalContractAddress) public payable {
    exampleExternalContract = ExampleExternalContract(exampleExternalContractAddress);
  }

  modifier withinDeadline {
    require(timeLeft() > 0, 'time ran out');
    _;
  }

  modifier outsideDeadline {
    require(timeLeft() <= 0, 'time still remaining');
    _;
  }

  modifier notCompleted {
    require(!exampleExternalContract.completed(), 'ExampleExternalContract already completed');
    _;
  }

  modifier thresholdNotMet {
    require(address(this).balance < threshold && timeLeft() <= 0, 'Staking treshold met, awaiting contract execution');
    _;
  }

  modifier thresholdMet {
    require(address(this).balance >= threshold, 'Staking threshold not met, funds available for withdrawal');
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
  function execute() public notCompleted outsideDeadline thresholdMet {
    exampleExternalContract.complete{value: address(this).balance}();
  }

  // if the `threshold` was not met, allow everyone to call a `withdraw()` function
  // modify for specific withdrawal amount
  function withdraw(uint256 amount) public notCompleted thresholdNotMet {
    uint balance = balances[msg.sender];
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
