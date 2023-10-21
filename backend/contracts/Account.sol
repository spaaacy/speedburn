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

    function transferFrom(address from, address to, uint256 tokenId) public override {
        if (to == address(0)) {
            revert ERC721InvalidReceiver(address(0));
        }
        // Receiver must not own account NFT or sender must be contract owner
        require(balanceOf(to) <= 0 || from == owner, "Address already owns account NFT");
        address previousOwner = _update(to, tokenId, _msgSender());
        if (previousOwner != from) {
            revert ERC721IncorrectOwner(from, tokenId, previousOwner);
        }
    }

    function mint() public onlyOwner {
        uint256 tokenId = nextTokenId++;
        _mint(msg.sender, tokenId);
    }
    
}
