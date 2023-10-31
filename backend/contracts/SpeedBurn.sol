// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";

contract SpeedBurn is ERC721, ERC721Enumerable, Ownable, EIP712, ERC721Votes {
    uint256 private _nextTokenId;

    constructor(
        address initialOwner
    )
        ERC721("SpeedBurn", "SBRN")
        Ownable(initialOwner)
        EIP712("SpeedBurn", "1")
    {}

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    // Custom function override to enforce ownership of only one account
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(IERC721, ERC721) {
        if (to == address(0)) {
            revert ERC721InvalidReceiver(address(0));
        }
        // Receiver must not own account NFT or sender must be contract owner
        require(
            balanceOf(to) <= 0 || from == owner(),
            "Address already owns account NFT"
        );
        address previousOwner = _update(to, tokenId, _msgSender());
        if (previousOwner != from) {
            revert ERC721IncorrectOwner(from, tokenId, previousOwner);
        }
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        override(ERC721, ERC721Enumerable, ERC721Votes)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable, ERC721Votes) {
        super._increaseBalance(account, value);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
