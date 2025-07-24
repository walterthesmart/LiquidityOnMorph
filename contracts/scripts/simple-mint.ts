import { ethers } from "hardhat";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Simple NGN Token Minting Script
 * 
 * This script mints a specified amount of NGN tokens directly
 */

interface DeploymentData {
  contracts: {
    ngnStablecoin: string;
  };
  network: string;
  chainId: number;
}

async function main(): Promise<void> {
  console.log("🪙 Simple NGN Token Minting Script");
  console.log("===================================\n");

  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const networkName = network.name === "unknown" ? "morph_holesky" : network.name;

  console.log(`📡 Network: ${networkName} (Chain ID: ${network.chainId})`);
  console.log(`👤 Deployer: ${deployer.address}\n`);

  // Load deployment data
  const deploymentFile = resolve(
    __dirname,
    `../deployments/morph-holesky-${network.chainId}.json`
  );

  let deploymentData: DeploymentData;
  try {
    deploymentData = JSON.parse(readFileSync(deploymentFile, "utf8")) as DeploymentData;
  } catch (error) {
    console.error(`❌ Could not load deployment file: ${deploymentFile}`);
    console.error("Please ensure the NGN contract is deployed first.");
    process.exit(1);
  }

  // Get NGN contract
  const ngnContract = await ethers.getContractAt(
    "NGNStablecoin",
    deploymentData.contracts.ngnStablecoin
  );

  console.log(`💰 NGN Contract: ${deploymentData.contracts.ngnStablecoin}`);

  // Check current balance and total supply
  const deployerBalance = await ngnContract.balanceOf(deployer.address);
  const totalSupply = await ngnContract.totalSupply();
  
  console.log(`📊 Current Status:`);
  console.log(`   Your Balance: ${ethers.formatEther(deployerBalance)} NGN`);
  console.log(`   Total Supply: ${ethers.formatEther(totalSupply)} NGN\n`);

  try {
    // Mint 10,000 NGN tokens
    const mintAmount = ethers.parseEther("10000");
    const recipient = deployer.address;

    console.log(`🔄 Minting ${ethers.formatEther(mintAmount)} NGN to ${recipient}...`);

    // Estimate gas first
    const gasEstimate = await ngnContract.mint.estimateGas(recipient, mintAmount);
    console.log(`⛽ Estimated gas: ${gasEstimate.toString()}`);

    // Execute minting with estimated gas + buffer
    const tx = await ngnContract.mint(recipient, mintAmount, {
      gasLimit: gasEstimate + 50000n, // Add buffer
    });
    
    console.log(`📤 Transaction hash: ${tx.hash}`);
    console.log(`⏳ Waiting for confirmation...`);

    const receipt = await tx.wait();
    console.log(`✅ Minting successful! Gas used: ${receipt?.gasUsed.toString()}`);

    // Show updated balances
    const newRecipientBalance = await ngnContract.balanceOf(recipient);
    const newTotalSupply = await ngnContract.totalSupply();

    console.log(`\n📊 Updated Status:`);
    console.log(`   Your Balance: ${ethers.formatEther(newRecipientBalance)} NGN`);
    console.log(`   Total Supply: ${ethers.formatEther(newTotalSupply)} NGN`);
    
  } catch (error: unknown) {
    console.error("❌ Error during minting:", error);
    
    // Try to get more specific error information
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    
    process.exit(1);
  }
}

// Execute script
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { main as simpleMint };
