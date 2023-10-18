//SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Marketplace {
    address public owner;
    address public nftAddress;
    mapping(uint256 => bool) public isListed;
    uint256 public price;

    constructor(address _nftAddress, uint256 _price) {
        owner = msg.sender;
        nftAddress = _nftAddress;
        price = _price;
    }

    function list(uint256 _nftId) public {
        isListed[_nftId] = true;
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftId);
    }

    function purchase(uint256 _nftId) public payable {
        require(isListed[_nftId], "NFT is not listed in the marketplace");
        require(msg.value >= price, "Ether transferred is insufficient");
        isListed[_nftId] = false;
        IERC721(nftAddress).approve(address(this), _nftId);
        IERC721(nftAddress).transferFrom(address(this), msg.sender, _nftId);
    }
    
    
}