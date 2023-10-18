//SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Blog is ERC721 {
    address public owner;
    mapping(uint256 => Post) public posts;
    uint256 public nextPostId;

    struct Post {
        string title;
        string body;
        uint256 timestamp;
        address author;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this method");
        _;
    }

     constructor() ERC721("SpeedBurn Post", "SBRNPST") {
        owner = msg.sender;
    }

    function mintPost(
        string calldata _title,
        string calldata _body,
        uint256 _timestamp
    ) external {
        Post memory post = Post(_title, _body, _timestamp, msg.sender);
        uint256 postId = nextPostId++;
        posts[postId] = post;
        _mint(msg.sender, postId);
    }
}
