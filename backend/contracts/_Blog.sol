//SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./SpeedBurn.sol";

contract Blog {
    address public owner;
    mapping(uint256 => Post) public posts;
    uint256 public nextPostId;
    SpeedBurn private _speedburn;


    struct Post {
        string title;
        string body;
        uint256 timestamp;
        address author;
    }

    modifier ownsAccount() {
        uint256 accountsOwned = _speedburn.balanceOf(msg.sender);
        require(accountsOwned > 0, "Address does not own an account NFT");
        _;
    }

    constructor(
        address _nftAddress
    ) {
        _speedburn = SpeedBurn(_nftAddress);
    }

    function createPost(
        string calldata _title,
        string calldata _body,
        uint256 _timestamp
    ) external ownsAccount {
        Post memory post = Post(_title, _body, _timestamp, msg.sender);
        uint256 postId = nextPostId++;
        posts[postId] = post;
    }
}
