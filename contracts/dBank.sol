// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./HanToken.sol";

contract dBank {
    // initialize token
    HanToken private token;

    // create a mapping of accounts with balance
    mapping(address => uint) public etherBalanceOf;
    mapping(address => uint) public depositStart;
    mapping(address => bool) public isDeposited;

    // events
    event Deposit(address indexed user, uint etherAmount, uint timeStart);
    event Withdraw(address indexed user, uint etherAmount, uint depositTime, uint interest);

    constructor(HanToken _token) {
        token = _token;
    }

    function deposit() payable public {
        require(isDeposited[msg.sender] == false, "Error Deposit Already Active");
        require(msg.value >= 1e16, "Error, Deposit must be >= 0.01 ETH");

        etherBalanceOf[msg.sender] = etherBalanceOf[msg.sender] + msg.value;

        depositStart[msg.sender] = depositStart[msg.sender] + block.timestamp;

        isDeposited[msg.sender] = true;

        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    function withdraw() public {
        require(isDeposited[msg.sender] == true, "Error, No Previous Deposit");

        uint userBalance = etherBalanceOf[msg.sender];

        uint depositTime = block.timestamp - depositStart[msg.sender];

        uint interestPerSecond = 31668017 * (etherBalanceOf[msg.sender] / 1e16);

        uint interest = interestPerSecond * depositTime;

        token.mint(msg.sender, interest);

        payable(msg.sender).transfer(userBalance);

        depositStart[msg.sender] = 0;
        etherBalanceOf[msg.sender] = 0;
        isDeposited[msg.sender] = false;

        emit Withdraw(msg.sender, userBalance, depositTime, interest);
    }
}