// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

  interface IMyNFT is IERC721 {
    function getPeers(address) external view returns (bool);
}
// The OpenZeppelin ERC-721 URI Storage extension is needed 
// to manage and store URIs for individual tokens. 
// This extension allows each token to have its own unique URI, 
// which can point to metadata about the token, such as images, 
// descriptions, and other attributes. This is particularly useful 
// for non-fungible tokens (NFTs) where each token is unique 
// and may have different metadata.

contract EnergyToken is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  address marketplaceContract;
  address recResponsible;
  event NFTMinted(uint256);
  mapping(address => bool) public peers;
  uint256 public peersNumber = 0;


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
    peersNumber = peersNumber +1;
  }




  function getPeers(address to) public view returns (bool){
      bool value = peers[to];
     return value;
  }

  function mint(string memory _tokenURI) public onlyRECpeers returns(uint256 newTokenID){
    _tokenIds.increment();
    uint256 newTokenId = _tokenIds.current();
    _safeMint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, _tokenURI);
    setApprovalForAll(marketplaceContract, true);
    emit NFTMinted(newTokenId);
    return newTokenId;
  }

        function getPeerNumber() public view returns (uint256) {
        return peersNumber;

      }
}