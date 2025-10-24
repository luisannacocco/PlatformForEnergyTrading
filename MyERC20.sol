// contracts/MyToken.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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

    function mint(address to, uint256 amount) public onlyMarketplaceResponsible {
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
