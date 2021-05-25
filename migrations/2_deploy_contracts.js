var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var HanToken = artifacts.require("./HanToken.sol");
var dBank = artifacts.require("./dBank.sol");

module.exports = async function(deployer) {
  await deployer.deploy(SimpleStorage);

  await deployer.deploy(HanToken);

  const hanToken = await HanToken.deployed();

  await deployer.deploy(dBank, hanToken.address);

  const bank = await dBank.deployed();

  await hanToken.passMinterRole(bank.address);
};
