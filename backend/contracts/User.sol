//SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Userbase {

    mapping(address => User) public users;

    struct User {
        string username;
    }
        


}