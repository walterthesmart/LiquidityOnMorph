import { ethers } from "hardhat";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Check NGN Token Roles Script
 * 
 * This script checks the roles assigned to addresses in the NGN stablecoin contract
 */

interface DeploymentData {
  contracts: {
    ngnStablecoin: string;
  };
  network: string;
  chainId: number;
}

async function main(): Promise<void> {
  console.log("🔍 NGN Token Roles Check Script");
  console.log("=================================\n");

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

  console.log(`💰 NGN Contract: ${deploymentData.contracts.ngnStablecoin}\n`);

  // Define role constants
  const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
  const ADMIN_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ADMIN_ROLE"));
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
  const BURNER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("BURNER_ROLE"));
  const PAUSER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("PAUSER_ROLE"));
  const COMPLIANCE_ROLE = ethers.keccak256(ethers.toUtf8Bytes("COMPLIANCE_ROLE"));

  try {
    // Check roles for deployer address
    console.log(`🔐 Roles for ${deployer.address}:`);
    console.log(`   DEFAULT_ADMIN_ROLE: ${await ngnContract.hasRole(DEFAULT_ADMIN_ROLE, deployer.address)}`);
    console.log(`   ADMIN_ROLE: ${await ngnContract.hasRole(ADMIN_ROLE, deployer.address)}`);
    console.log(`   MINTER_ROLE: ${await ngnContract.hasRole(MINTER_ROLE, deployer.address)}`);
    console.log(`   BURNER_ROLE: ${await ngnContract.hasRole(BURNER_ROLE, deployer.address)}`);
    console.log(`   PAUSER_ROLE: ${await ngnContract.hasRole(PAUSER_ROLE, deployer.address)}`);
    console.log(`   COMPLIANCE_ROLE: ${await ngnContract.hasRole(COMPLIANCE_ROLE, deployer.address)}\n`);

    // Check contract configuration
    const config = await ngnContract.getConfig();
    console.log(`⚙️ Contract Configuration:`);
    console.log(`   Minting Enabled: ${config.mintingEnabled}`);
    console.log(`   Burning Enabled: ${config.burningEnabled}`);
    console.log(`   Transfers Enabled: ${config.transfersEnabled}`);
    console.log(`   Max Supply: ${ethers.formatEther(config.maxSupply)} NGN`);
    console.log(`   Daily Minting Cap: ${ethers.formatEther(config.mintingCap)} NGN`);
    console.log(`   Current Day Minted: ${ethers.formatEther(config.currentDayMinted)} NGN\n`);

    // Check if contract is paused
    const isPaused = await ngnContract.paused();
    console.log(`⏸️ Contract Paused: ${isPaused}\n`);

    // Check current supply
    const totalSupply = await ngnContract.totalSupply();
    const deployerBalance = await ngnContract.balanceOf(deployer.address);
    console.log(`📊 Token Status:`);
    console.log(`   Total Supply: ${ethers.formatEther(totalSupply)} NGN`);
    console.log(`   Deployer Balance: ${ethers.formatEther(deployerBalance)} NGN`);

  } catch (error: unknown) {
    console.error("❌ Error checking roles:", error);
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

export { main as checkRoles };
