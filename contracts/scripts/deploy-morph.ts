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

    // Create the ManagerConfig struct
    const managerConfig = {
      defaultFeeRate: 30, // default fee rate
      defaultLiquidityTarget: ethers.parseEther("100000"), // default liquidity target
      defaultRebalanceThreshold: 1000, // rebalance threshold
      maxPairsPerBatch: 10, // max pairs per batch
      autoLiquidityEnabled: true, // auto liquidity enabled
      emergencyWithdrawDelay: 86400 // emergency withdraw delay
    };

    const tradingPairManager = await TradingPairManager.deploy(
      ngnAddress,
      dexAddress,
      factoryAddress,
      deployer.address, // admin address
      managerConfig
    );
    await tradingPairManager.waitForDeployment();
    const managerAddress = await tradingPairManager.getAddress();
    deploymentResult.contracts.tradingPairManager = managerAddress;
    console.log("✅ Trading Pair Manager deployed to:", managerAddress);

    // Deploy Nigerian stock tokens
    console.log("\n🏢 Deploying Nigerian Stock Tokens...");
    const stockTokens = [
      // Banking Sector
      { name: "Zenith Bank", symbol: "ZENITHBANK", supply: "31396000", companyName: "Zenith Bank Plc", sector: "Banking" },
      { name: "Guaranty Trust Bank", symbol: "GTCO", supply: "29431000", companyName: "Guaranty Trust Holding Company Plc", sector: "Banking" },
      { name: "Access Bank", symbol: "ACCESS", supply: "35000000", companyName: "Access Holdings Plc", sector: "Banking" },
      { name: "United Bank for Africa", symbol: "UBA", supply: "33681000", companyName: "United Bank for Africa Plc", sector: "Banking" },
      { name: "First Bank of Nigeria", symbol: "FBNH", supply: "35895000", companyName: "FBN Holdings Plc", sector: "Banking" },
      { name: "Stanbic IBTC Bank", symbol: "IBTCCORP", supply: "11000000", companyName: "Stanbic IBTC Holdings Plc", sector: "Banking" },
      { name: "Fidelity Bank", symbol: "FIDELITYBK", supply: "32000000", companyName: "Fidelity Bank Plc", sector: "Banking" },
      { name: "Sterling Bank", symbol: "STERLINGNG", supply: "29000000", companyName: "Sterling Financial Holdings Company Plc", sector: "Banking" },

      // Telecommunications
      { name: "MTN Nigeria", symbol: "MTNN", supply: "20354000", companyName: "MTN Nigeria Communications Plc", sector: "ICT" },
      { name: "Airtel Africa", symbol: "AIRTELAFRI", supply: "3755000", companyName: "Airtel Africa Plc", sector: "ICT" },

      // Oil & Gas
      { name: "Seplat Energy", symbol: "SEPLAT", supply: "593000", companyName: "Seplat Energy Plc", sector: "Oil & Gas" },
      { name: "Total Energies", symbol: "TOTAL", supply: "1000000", companyName: "Total Energies Marketing Nigeria Plc", sector: "Oil & Gas" },
      { name: "Conoil", symbol: "CONOIL", supply: "1000000", companyName: "Conoil Plc", sector: "Oil & Gas" },

      // Industrial Goods
      { name: "Dangote Cement", symbol: "DANGCEM", supply: "17040000", companyName: "Dangote Cement Plc", sector: "Industrial Goods" },
      { name: "BUA Cement", symbol: "BUACEMENT", supply: "17000000", companyName: "BUA Cement Plc", sector: "Industrial Goods" },
      { name: "Lafarge Africa", symbol: "WAPCO", supply: "18000000", companyName: "Lafarge Africa Plc", sector: "Industrial Goods" },

      // Consumer Goods
      { name: "Nigerian Breweries", symbol: "NB", supply: "9000000", companyName: "Nigerian Breweries Plc", sector: "Consumer Goods" },
      { name: "Nestle Nigeria", symbol: "NESTLE", supply: "1500000", companyName: "Nestle Nigeria Plc", sector: "Consumer Goods" },
      { name: "Unilever Nigeria", symbol: "UNILEVER", supply: "6000000", companyName: "Unilever Nigeria Plc", sector: "Consumer Goods" },
      { name: "Cadbury Nigeria", symbol: "CADBURY", supply: "2000000", companyName: "Cadbury Nigeria Plc", sector: "Consumer Goods" },
      { name: "Flour Mills", symbol: "FLOURMILL", supply: "2000000", companyName: "Flour Mills of Nigeria Plc", sector: "Consumer Goods" },

      // Insurance
      { name: "AIICO Insurance", symbol: "AIICO", supply: "6000000", companyName: "AIICO Insurance Plc", sector: "Insurance" },
      { name: "Sovereign Trust Insurance", symbol: "SOVRENINS", supply: "2000000", companyName: "Sovereign Trust Insurance Plc", sector: "Insurance" },

      // Agriculture
      { name: "Livestock Feeds", symbol: "LIVESTOCK", supply: "2000000", companyName: "Livestock Feeds Plc", sector: "Agriculture" },
      { name: "Okomu Oil Palm", symbol: "OKOMUOIL", supply: "1200000", companyName: "Okomu Oil Palm Company Plc", sector: "Agriculture" },

      // Healthcare
      { name: "May & Baker", symbol: "MAYBAKER", supply: "1000000", companyName: "May & Baker Nigeria Plc", sector: "Healthcare" },
      { name: "Fidson Healthcare", symbol: "FIDSON", supply: "4000000", companyName: "Fidson Healthcare Plc", sector: "Healthcare" },

      // Conglomerates
      { name: "Transnational Corporation", symbol: "TRANSCORP", supply: "40000000", companyName: "Transnational Corporation Plc", sector: "Conglomerates" },
      { name: "John Holt", symbol: "JOHNHOLT", supply: "500000", companyName: "John Holt Plc", sector: "Conglomerates" },

      // Real Estate
      { name: "UPDC Real Estate", symbol: "UPDC", supply: "4000000", companyName: "UPDC Real Estate Investment Trust", sector: "Real Estate" },

      // Technology
      { name: "CWG", symbol: "CWG", supply: "2000000", companyName: "Computer Warehouse Group Plc", sector: "ICT" }
    ];

    deploymentResult.contracts.tokens = {};

    for (const stock of stockTokens) {
      console.log(`📈 Deploying ${stock.name} (${stock.symbol})...`);

      // Create the StockMetadata struct
      const stockMetadata = {
        symbol: stock.symbol,
        companyName: stock.companyName,
        sector: stock.sector,
        totalShares: ethers.parseEther(stock.supply),
        marketCap: ethers.parseEther("1000000000"), // 1B NGN market cap
        isActive: true,
        lastUpdated: Math.floor(Date.now() / 1000)
      };

      const tx = await stockFactory.deployStockToken(
        stock.name,
        stock.symbol,
        ethers.parseEther(stock.supply),
        stockMetadata,
        deployer.address // token admin
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
