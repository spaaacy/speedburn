//SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Account is ERC721 {
    address private owner;
    uint256 public nextTokenId;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this method");
        _;
    }

    constructor() ERC721("SpeedBurn", "SBRN") {
        owner = msg.sender;
    }

    function mint() public onlyOwner {
        uint256 tokenId = nextTokenId++;
        _mint(msg.sender, tokenId);
    }
    
}
