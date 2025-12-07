// contracts/MyToken.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./EnergyToken.sol";


 
contract MyERC20 is ERC20, Ownable {

  address marketplaceContract;
  address marketplaceResponsible;

    constructor(address _marketplaceContract) ERC20("MyToken", "MTK") {
        marketplaceContract = _marketplaceContract;
        marketplaceResponsible = msg.sender;
    }

  modifier onlyMarketplaceResponsible() {
      require(marketplaceResponsible == msg.sender, "Not the marketplace Responsible");
      _;
  }

    function mint(address _nftContract, address to, uint256 amount) public onlyMarketplaceResponsible {
        IMyNFT nftContract = IMyNFT(_nftContract);
        require(nftContract.getPeers(to) == true, "Not a REC peer");
        _mint(to, amount);
        _approve(to, marketplaceContract, amount);
    }

      function getMPcontract() public view returns (address) {
        return marketplaceContract;

      }

      function getMResponsible() public view returns (address) {
        return marketplaceResponsible;
      }
}
