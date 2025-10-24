// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EnergyToken is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  address marketplaceContract;
  address recResponsible;
  event NFTMinted(uint256);
  mapping(address => bool) public peers;

  constructor(address _marketplaceContract) ERC721("Energy Token REC", "E_REC") {
    marketplaceContract = _marketplaceContract;
    recResponsible = msg.sender;
  }

  modifier onlyRECpeers() {
      require(peers[msg.sender] == true, "Not a REC peer");
      _;
  }

  modifier onlyRECresponsible() {
      require(recResponsible == msg.sender, "Not the REC responsible");
      _;
  }

  function addPeers (address _peerAddress) public onlyRECresponsible {
    peers[_peerAddress]= true;
  }

  function mint(string memory _tokenURI) public onlyRECpeers{
    _tokenIds.increment();
    uint256 newTokenId = _tokenIds.current();
    _safeMint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, _tokenURI);
    setApprovalForAll(marketplaceContract, true);
    emit NFTMinted(newTokenId);
  }
}