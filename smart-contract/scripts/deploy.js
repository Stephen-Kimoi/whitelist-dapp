const { ethers } = require("hardhat"); 

const main = async () => {
  const whitelistContract = await ethers.getContractFactory("Whitelist"); 
  // Deploy the contract 
  const deployedWhitelistContract = await whitelistContract.deploy(10); 
  // Wait till it's finished deploying
  await deployedWhitelistContract.deployed(); 
  
  console.log("Whitelist contract address: ", deployedWhitelistContract.address); 

} 

const runMain = async () => {
  try {
    await main(); 
    process.exit(0); 
  } catch (error) {
    console.error(error); 
    process.exit(1); 
  }
} 

runMain(); 