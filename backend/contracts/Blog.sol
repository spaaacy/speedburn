//SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Account.sol";

contract Blog is ERC721 {
    address public owner;
    mapping(uint256 => Post) public posts;
    uint256 public nextPostId;
    Account private _account;

    struct Post {
        string title;
        string body;
        uint256 timestamp;
        address author;
    }

     constructor(address _accountAddress) ERC721("SpeedBurn Post", "SBRNPST") {
        owner = msg.sender;
        _account = Account(_accountAddress);
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this method");
        _;
    }

    function mintPost(
        string calldata _title,
        string calldata _body,
        uint256 _timestamp
    ) external {
        uint256 accountsOwned = _account.balanceOf(msg.sender);
        require(accountsOwned > 0, "Address does not own an account NFT");
        Post memory post = Post(_title, _body, _timestamp, msg.sender);
        uint256 postId = nextPostId++;
        posts[postId] = post;
        _mint(msg.sender, postId);
    }
}
