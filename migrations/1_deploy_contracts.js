var EnergyToken = artifacts.require("EnergyToken");
var Marketplace = artifacts.require("Marketplace");
var MyToken= artifacts.require("MyToken");
var Auction = artifacts.require("Auction");
var MyERC20= artifacts.require("MyERC20");
module.exports = async function(deployer) {
  await deployer.deploy(Marketplace);
  const marketplace = await Marketplace.deployed();
  await deployer.deploy(EnergyToken, marketplace.address);
  await deployer.deploy(Auction);
  const auction = await Auction.deployed();
  await deployer.deploy(MyToken,auction.address);
  await deployer.deploy(MyERC20);
  await MyERC20.deployed();
}