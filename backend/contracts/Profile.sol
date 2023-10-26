//SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;
import "./Account.sol";

contract Profile {
    mapping(address => User) public profiles;
    address private owner;
    Account private _account;

    struct User {
        string username;
        string displayPicture;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this method");
        _;
    }

    constructor(address _accountAddress) {
        owner = msg.sender;
        _account = Account(_accountAddress);
    }

    function createUser(string calldata _username, string calldata _displayPicture) public {
        uint256 accountsOwned = _account.balanceOf(msg.sender);
        require(accountsOwned > 0, "Address does not own an account NFT");
        require(bytes(profiles[msg.sender].username).length <= 0, "Address already has an existing profile");
        profiles[msg.sender] = User(_username, _displayPicture);
    }

}
