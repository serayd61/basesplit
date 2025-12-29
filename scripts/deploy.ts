const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;
  
  console.log("🚀 Deploying BaseSplit Protocol to Base...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy BaseSplit
  console.log("📦 Deploying BaseSplit...");
  const BaseSplit = await ethers.getContractFactory("BaseSplit");
  const baseSplit = await BaseSplit.deploy();
  await baseSplit.waitForDeployment();
  const baseSplitAddress = await baseSplit.getAddress();
  console.log("✅ BaseSplit deployed to:", baseSplitAddress);

  // Deploy BaseSplitFactory
  console.log("\n📦 Deploying BaseSplitFactory...");
  const BaseSplitFactory = await ethers.getContractFactory("BaseSplitFactory");
  const factory = await BaseSplitFactory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("✅ BaseSplitFactory deployed to:", factoryAddress);

  console.log("\n" + "=".repeat(50));
  console.log("🎉 Deployment Complete!");
  console.log("=".repeat(50));
  console.log("\nContract Addresses:");
  console.log("  BaseSplit:", baseSplitAddress);
  console.log("  BaseSplitFactory:", factoryAddress);
  console.log("\n📝 .env dosyasına bu adresleri ekle:");
  console.log(`  NEXT_PUBLIC_BASESPLIT_ADDRESS=${baseSplitAddress}`);
  console.log(`  NEXT_PUBLIC_FACTORY_ADDRESS=${factoryAddress}`);
  console.log("\nNext steps:");
  console.log("  1. Verify contracts on Basescan");
  console.log("  2. Update frontend with contract addresses");
  console.log("  3. Create your first split!");

  // Return addresses for verification
  return { baseSplitAddress, factoryAddress };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
