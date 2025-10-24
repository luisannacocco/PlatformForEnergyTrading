// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./EnergyToken.sol";

contract Auction is ReentrancyGuard {
  
  using Counters for Counters.Counter;
  Counters.Counter private _nftsSold;
  Counters.Counter private _nftCount;
  address payable private _marketOwner;
  mapping(uint256 => NFT) public _idToNFT;
  mapping(uint256 => AuctionInfo) public auctions;
  mapping(uint256 => bool) public claimedNFT;

  struct AuctionInfo {
      address payable seller;
      uint256 tokenId;
      uint256 highestBid;
      address payable highestBidder;
      bool ended;
  }

  struct NFT {
      address nftContract;
      uint256 tokenId;
      address payable seller;
      address payable owner;
      uint256 price;
      bool listed;
  }

  event NewBid(address indexed bidder, uint256 indexed tokenId, uint256 amount);
  event AuctionEnded(uint256 indexed tokenId, address indexed winner, uint256 amount);
  event Claimed(address indexed bidder, uint256 indexed tokenID);
  event NFTListed(address nftContract, uint256 tokenId, address seller, address owner, uint256 price);
  event NFTSold(address nftContract, uint256 tokenId, address seller, address owner, uint256 price);
  
  constructor() {
      _marketOwner = payable(msg.sender);
  }

  function getListedNfts() public view returns (NFT[] memory) {
    uint256 nftCount = _nftCount.current();
    uint256 unsoldNftsCount = nftCount - _nftsSold.current();
    NFT[] memory nfts = new NFT[](unsoldNftsCount);
    uint nftsIndex = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToNFT[i + 1].listed) {
        nfts[nftsIndex] = _idToNFT[i + 1];
        nftsIndex++;
      }
    }
    return nfts;
  }

  function getMyNfts() public view returns (NFT[] memory) {
    uint nftCount = _nftCount.current();
    uint myNftCount = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToNFT[i + 1].owner == msg.sender) {
        myNftCount++;
      }
    }
    NFT[] memory nfts = new NFT[](myNftCount);
    uint nftsIndex = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToNFT[i + 1].owner == msg.sender) {
        nfts[nftsIndex] = _idToNFT[i + 1];
        nftsIndex++;
      }
    }
    return nfts;
  }

  function getMyListedNfts() public view returns (NFT[] memory) {
    uint nftCount = _nftCount.current();
    uint myListedNftCount = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToNFT[i + 1].seller == msg.sender && _idToNFT[i + 1].listed) {
        myListedNftCount++;
      }
    }
    NFT[] memory nfts = new NFT[](myListedNftCount);
    uint nftsIndex = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToNFT[i + 1].seller == msg.sender && _idToNFT[i + 1].listed) {
        nfts[nftsIndex] = _idToNFT[i + 1];
        nftsIndex++;
      }
    }
    return nfts;
  }

  modifier auctionExists(uint256 tokenId) {
      require(auctions[tokenId].seller != address(0), "Auction does not exist");
      _;
  }

  modifier onlySeller(uint256 tokenId) {
      require(auctions[tokenId].seller == msg.sender, "Not the auction seller");
      _;
  }

  // this function return the sellers address
  function getSeller(uint256 auctionId) external view returns (address) {
      return auctions[auctionId].seller;
  }

  // this function return the highest bidder address
  function getHighestBidder(uint256 auctionId) external view returns (address) {
      return auctions[auctionId].highestBidder;
  }

  function isEnded(uint256 auctionId) external view returns (bool) {
      return auctions[auctionId].ended;
  }

// this function start the auction, so
//it Lists the NFT on the marketplace
  function startAuction(
      address tokenContract,
      uint256 tokenId
  ) external nonReentrant {
      EnergyToken nft = EnergyToken(tokenContract);
      require(nft.ownerOf(tokenId) == msg.sender, "Not token owner");
      nft.transferFrom(msg.sender, address(this), tokenId);
      auctions[tokenId] = AuctionInfo({
          seller: payable(msg.sender),
          tokenId: tokenId,
          highestBid: 0,
          highestBidder: payable(address(0)),
          ended: false
      });
    _nftCount.increment();
    _idToNFT[tokenId] = NFT(
      tokenContract,
      tokenId, 
      payable(msg.sender),
      payable(address(this)),
      0,
      true
    );
    emit NFTListed(tokenContract, tokenId, msg.sender, address(this), 0);
    }

    // this function post a bid and replace the highest bid 
    //if the new bid is higher than the highest bid
  function bid(uint256 tokenId,uint256 _price) external payable nonReentrant auctionExists(tokenId) {
      AuctionInfo storage auction = auctions[tokenId];
      require(!auction.ended, "Auction already ended");
      require(_price > auction.highestBid, "Bid too low");
      if (auction.highestBidder != address(0)) {
          auction.highestBidder.transfer(auction.highestBid);
      }
      auction.highestBid = _price;
      auction.highestBidder = payable(msg.sender);
      emit NewBid(msg.sender, tokenId, _price);
  }

  // this function ends the auction
  function endAuction(uint256 tokenId) external nonReentrant auctionExists(tokenId) onlySeller(tokenId){
      AuctionInfo storage auction = auctions[tokenId];
      require(!auction.ended, "Auction already ended");
      auction.ended = true;
      emit AuctionEnded(tokenId, auction.highestBidder, auction.highestBid);
  }

  // this function claims the NFT and transfer the nft to the winner 
  function claimNFT(uint256 tokenId,address tokenContract) external nonReentrant auctionExists(tokenId) {
      AuctionInfo storage auction = auctions[tokenId];
      require(auction.ended, "Auction not ended");
      require(auction.highestBidder == msg.sender,"not the winner");
      EnergyToken nft = EnergyToken(tokenContract);
      if(!claimedNFT[tokenId]){
        nft.transferFrom(address(this), msg.sender, tokenId);
        claimedNFT[tokenId] = true; 
        emit Claimed(msg.sender, tokenId);
        _idToNFT[tokenId].listed = false;
        _idToNFT[tokenId].price = auction.highestBid;
        _idToNFT[tokenId].owner = payable(msg.sender);
        _nftsSold.increment();
        emit NFTSold(tokenContract, tokenId, auction.seller, msg.sender, auction.highestBid);
        }else{
          revert("already claimed");
      }
  }

// this function withdraw the NFT 
  function withdraw(uint256 tokenId,address tokenContract) external nonReentrant auctionExists(tokenId) {
    AuctionInfo storage auction = auctions[tokenId];
    require(auction.ended, "Auction not ended");
    NFT storage nft = _idToNFT[tokenId];
    if (msg.sender == auction.seller) {
      require(auction.highestBidder == address(0), "Cannot withdraw, auction ended");
      EnergyToken MYnft = EnergyToken(tokenContract);
      // tranfer the nft back to the seller
      MYnft.transferFrom(address(this), auction.seller, tokenId);
      nft.owner = payable(auction.seller);
      nft.listed = false;
      } else if (msg.sender == auction.highestBidder) {
        require(!claimedNFT[tokenId], "Bidder already received NFT");
        payable(msg.sender).transfer(auction.highestBid);
        nft.owner = payable(msg.sender);
        nft.listed = false;
      } else {
          revert("Not allowed to withdraw");
      }
  }
}
