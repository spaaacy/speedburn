// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";

contract SpeedBurn is ERC721, ERC721Enumerable, Ownable, EIP712, ERC721Votes {
    uint256 private _nextTokenId;
    address private _marketplace;
    mapping(uint256 => Clause) public constitution;
    uint256 public nextAmendmentId;

    struct Clause {
        string guideline;
        bool active;
    }

    constructor(
        address initialOwner,
        string[] memory _constitution
    )
        ERC721("SpeedBurn", "SBRN")
        Ownable(initialOwner)
        EIP712("SpeedBurn", "1")
    {
        for (uint256 i = 0; i < _constitution.length; ++i) {
            _amendConstitution(_constitution[i]);
        }
    }

    function amendConstitution(string calldata _amendment) public onlyOwner {
        _amendConstitution(_amendment);
    }

    function _amendConstitution(string memory _amendment) private {
        uint256 amendmentId = nextAmendmentId++;
        constitution[amendmentId] = Clause(_amendment, true);
    }

    function setMarketplaceAddress(
        address _marketplaceAddress
    ) public onlyOwner {
        _marketplace = _marketplaceAddress;
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
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
