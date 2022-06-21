require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  "networks":{
      "test":{
         "url":"https://eth-rinkeby.alchemyapi.io/v2/38M5j3ponQON1zC9wDbfEetSLuFBHeWw",
         "accounts":[
            "0xfc4c78a12d02517b25c43f85903283778195bad4835760ac650957d087fd1f2d"
         ]
      }
   }
};
