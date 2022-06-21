// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  [owner] = await hre.ethers.getSigners();
  console.log(owner.address);

  // We get the contract to deploy

  //GBP token
  const GBP = await hre.ethers.getContractFactory("GBP");
  const gbp = await GBP.deploy();
  await gbp.deployed();
  console.log("GBP deployed to:", gbp.address);
  await gbp.mint(owner.address, 10000000);
  console.log("GBP balance: " + await gbp.balanceOf(owner.address));

  //BTC token
  const BTC = await hre.ethers.getContractFactory("BTC");
  const btc = await BTC.deploy();
  await btc.deployed();
  console.log("BTC deployed to:", btc.address);
  await btc.mint(owner.address, 1000);
  console.log("BTC balance: " + await gbp.balanceOf(owner.address));

  //BBTC token
  const BBTC = await hre.ethers.getContractFactory("BBTC");
  const bbtc = await BBTC.deploy();
  await bbtc.deployed();
  console.log("BBTC deployed to:", bbtc.address);
  await bbtc.mint(owner.address, 1000);
  console.log("BBTC balance: " + await gbp.balanceOf(owner.address));

  const Swap = await ethers.getContractFactory("Swap");
  const swap = await Swap.deploy(gbp.address, btc.address, bbtc.address);
  await swap.deployed();
  console.log("Swap address: " + swap.address);  

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

//npx hardhat run scripts/sample-script.js — network localhost