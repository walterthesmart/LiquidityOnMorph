import { ethers } from "hardhat";
import { writeFileSync } from "fs";
import { resolve } from "path";

/**
 * Simple Morph Deployment Script
 * Deploys core contracts to Morph Holesky testnet
 */

async function deployToMorph() {
  console.log("🚀 Starting Morph Deployment...");
  
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log("📡 Network:", network.name);
  console.log("🔗 Chain ID:", network.chainId.toString());
  console.log("👤 Deployer:", deployer.address);
  console.log("💰 Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");
  
  const deploymentResult: any = {
    network: "Morph Holesky Testnet",
    chainId: Number(network.chainId),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {},
    gasUsed: "0"
  };

  try {
    // Deploy NGN Stablecoin
    console.log("\n📄 Deploying NGN Stablecoin...");
    const NGNStablecoin = await ethers.getContractFactory("NGNStablecoin");

    // Create the StablecoinConfig struct
    const stablecoinConfig = {
      name: "Nigerian Naira Stablecoin",
      symbol: "NGN",
      decimals: 18,
      maxSupply: ethers.parseEther("1000000000"), // 1B max supply
      mintingCap: ethers.parseEther("10000000"), // 10M daily minting cap
      lastMintReset: 0, // Will be set in constructor
      currentDayMinted: 0, // Will be set in constructor
      mintingEnabled: true,
      burningEnabled: true,
      transfersEnabled: true
    };

    const ngnStablecoin = await NGNStablecoin.deploy(
      deployer.address, // admin address
      stablecoinConfig
    );
    await ngnStablecoin.waitForDeployment();
    const ngnAddress = await ngnStablecoin.getAddress();
    deploymentResult.contracts.ngnStablecoin = ngnAddress;
    console.log("✅ NGN Stablecoin deployed to:", ngnAddress);

    // Deploy Stock Token Factory
    console.log("\n🏭 Deploying Stock Token Factory...");
    const StockFactory = await ethers.getContractFactory("NigerianStockTokenFactory");
    const stockFactory = await StockFactory.deploy(deployer.address);
    await stockFactory.waitForDeployment();
    const factoryAddress = await stockFactory.getAddress();
    deploymentResult.contracts.stockFactory = factoryAddress;
    console.log("✅ Stock Factory deployed to:", factoryAddress);

    // Deploy StockNGNDEX
    console.log("\n💱 Deploying StockNGNDEX...");
    const StockNGNDEX = await ethers.getContractFactory("StockNGNDEX");

    // Create the DEXConfig struct
    const dexConfig = {
      defaultFeeRate: 30, // 0.3% fee
      maxPriceImpact: 500, // 5% max price impact
      minLiquidity: ethers.parseEther("1000"), // min liquidity
      swapDeadline: 1800, // 30 min deadline
      emergencyMode: false // emergency mode
    };

    const stockNGNDEX = await StockNGNDEX.deploy(
      ngnAddress,
      deployer.address, // admin address
      dexConfig
    );
    await stockNGNDEX.waitForDeployment();
    const dexAddress = await stockNGNDEX.getAddress();
    deploymentResult.contracts.stockNGNDEX = dexAddress;
    console.log("✅ StockNGNDEX deployed to:", dexAddress);

    // Deploy Trading Pair Manager
    console.log("\n📊 Deploying Trading Pair Manager...");
    const TradingPairManager = await ethers.getContractFactory("TradingPairManager");
    const tradingPairManager = await TradingPairManager.deploy(
      dexAddress,
      ngnAddress,
      30, // default fee rate
      ethers.parseEther("100000"), // default liquidity target
      1000, // rebalance threshold
      10, // max pairs per batch
      true, // auto liquidity enabled
      86400 // emergency withdraw delay
    );
    await tradingPairManager.waitForDeployment();
    const managerAddress = await tradingPairManager.getAddress();
    deploymentResult.contracts.tradingPairManager = managerAddress;
    console.log("✅ Trading Pair Manager deployed to:", managerAddress);

    // Deploy some sample stock tokens
    console.log("\n🏢 Deploying Sample Stock Tokens...");
    const stockTokens = [
      { name: "Dangote Cement", symbol: "DANGCEM", supply: "1000000" },
      { name: "MTN Nigeria", symbol: "MTNN", supply: "2000000" },
      { name: "Zenith Bank", symbol: "ZENITHBANK", supply: "3000000" }
    ];

    deploymentResult.contracts.tokens = {};
    
    for (const stock of stockTokens) {
      console.log(`📈 Deploying ${stock.name} (${stock.symbol})...`);
      const tx = await stockFactory.createStockToken(
        stock.name,
        stock.symbol,
        ethers.parseEther(stock.supply),
        stock.name,
        "Finance", // sector
        ethers.parseEther("1000000000") // market cap
      );
      const receipt = await tx.wait();
      
      // Get the token address from the event
      const event = receipt?.logs.find((log: any) => {
        try {
          const parsed = stockFactory.interface.parseLog(log);
          return parsed?.name === "StockTokenDeployed";
        } catch {
          return false;
        }
      });
      
      if (event) {
        const parsed = stockFactory.interface.parseLog(event);
        const tokenAddress = parsed?.args[1];
        deploymentResult.contracts.tokens[stock.symbol] = tokenAddress;
        console.log(`✅ ${stock.symbol} deployed to:`, tokenAddress);
      }
    }

    // Save deployment results
    const deploymentFile = resolve(__dirname, `../deployments/morph-holesky-${network.chainId}.json`);
    writeFileSync(deploymentFile, JSON.stringify(deploymentResult, null, 2));
    console.log("\n📁 Deployment saved to:", deploymentFile);

    console.log("\n🎉 Deployment completed successfully!");
    console.log("\n📋 Summary:");
    console.log("NGN Stablecoin:", deploymentResult.contracts.ngnStablecoin);
    console.log("Stock Factory:", deploymentResult.contracts.stockFactory);
    console.log("StockNGNDEX:", deploymentResult.contracts.stockNGNDEX);
    console.log("Trading Pair Manager:", deploymentResult.contracts.tradingPairManager);
    console.log("Stock Tokens:", Object.keys(deploymentResult.contracts.tokens).length);

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
}

// Run deployment
if (require.main === module) {
  deployToMorph()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { deployToMorph };
