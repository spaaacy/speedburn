//SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;
import "./SpeedBurn.sol";

contract Profile {
    mapping(address => User) public profiles;
    address private owner;
    SpeedBurn private _speedburn;

    struct User {
        string username;
        string displayPicture;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this method");
        _;
    }

    modifier ownsAccount() {
        uint256 accountsOwned = _speedburn.balanceOf(msg.sender);
        require(accountsOwned > 0, "Address does not own an account NFT");
        _;
    }

    constructor(address _nftAddress) {
        owner = msg.sender;
        _speedburn = SpeedBurn(_nftAddress);
    }

    function createUser(
        string calldata _username,
        string calldata _displayPicture
    ) public ownsAccount {
        require(
            bytes(profiles[msg.sender].username).length <= 0,
            "Address already has an existing profile"
        );
        profiles[msg.sender] = User(_username, _displayPicture);
    }

    function setDisplayPicture(string calldata _displayPicture) public ownsAccount {
        profiles[msg.sender].displayPicture = _displayPicture;
    }

    function setUsername(string calldata _username) public ownsAccount {
        profiles[msg.sender].username = _username;
    }
    
}
