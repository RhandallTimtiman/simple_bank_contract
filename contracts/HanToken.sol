// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HanToken is ERC20 {
    address public minter;

    event MinterChange(address indexed from, address to);

    constructor() ERC20("HanToken", "HT") {
        minter = msg.sender;
    }

    function passMinterRole(address dBank) public returns (bool) {
        require(msg.sender == minter, "Error, only owner can pass the minter role");
        minter = dBank;

        emit MinterChange(msg.sender, dBank);
        return true;
    }

    function mint(address account, uint256 amount) public {
        require(msg.sender == minter, "Error, msg.sender does not have the minter role");
        _mint(account, amount);
    }
}