const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;
  
  console.log("🚀 Deploying BaseSplitFactory to Base...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy BaseSplitFactory
  console.log("📦 Deploying BaseSplitFactory...");
  const BaseSplitFactory = await ethers.getContractFactory("BaseSplitFactory");
  const factory = await BaseSplitFactory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("✅ BaseSplitFactory deployed to:", factoryAddress);

  console.log("\n🎉 Done! Add to .env:");
  console.log(`  NEXT_PUBLIC_FACTORY_ADDRESS=${factoryAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
