const { expect } = require("chai");
const hre = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const ethers = hre.ethers;

describe("BaseSplit", function () {
  async function deployBaseSplitFixture() {
    const [owner, holder1, holder2, holder3, depositor] = await ethers.getSigners();

    const BaseSplit = await ethers.getContractFactory("BaseSplit");
    const baseSplit = await BaseSplit.deploy();

    const BaseSplitFactory = await ethers.getContractFactory("BaseSplitFactory");
    const factory = await BaseSplitFactory.deploy();

    return { baseSplit, factory, owner, holder1, holder2, holder3, depositor };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { baseSplit, owner } = await loadFixture(deployBaseSplitFixture);
      expect(await baseSplit.owner()).to.equal(owner.address);
    });

    it("Should have correct initial values", async function () {
      const { baseSplit } = await loadFixture(deployBaseSplitFixture);
      expect(await baseSplit.splitCounter()).to.equal(0);
      expect(await baseSplit.protocolFee()).to.equal(100); // 1%
      expect(await baseSplit.totalFeesCollected()).to.equal(0);
    });
  });

  describe("Create Split", function () {
    it("Should create a split with valid parameters", async function () {
      const { baseSplit, owner, holder1, holder2 } = await loadFixture(deployBaseSplitFixture);
      
      const holders = [holder1.address, holder2.address];
      const shares = [50n, 50n];
      
      await expect(baseSplit.createSplit("Test Split", holders, shares))
        .to.emit(baseSplit, "SplitCreated");
      
      expect(await baseSplit.splitCounter()).to.equal(1);
    });

    it("Should reject split with no holders", async function () {
      const { baseSplit } = await loadFixture(deployBaseSplitFixture);
      
      await expect(baseSplit.createSplit("Empty Split", [], []))
        .to.be.revertedWith("No holders");
    });

    it("Should reject split with mismatched arrays", async function () {
      const { baseSplit, holder1, holder2 } = await loadFixture(deployBaseSplitFixture);
      
      await expect(baseSplit.createSplit("Bad Split", [holder1.address, holder2.address], [50n]))
        .to.be.revertedWith("Length mismatch");
    });

    it("Should mint NFTs to holders", async function () {
      const { baseSplit, holder1, holder2 } = await loadFixture(deployBaseSplitFixture);
      
      await baseSplit.createSplit("NFT Test", [holder1.address, holder2.address], [60n, 40n]);
      
      expect(await baseSplit.balanceOf(holder1.address)).to.equal(1);
      expect(await baseSplit.balanceOf(holder2.address)).to.equal(1);
    });
  });

  describe("Deposit", function () {
    it("Should accept deposits to active split", async function () {
      const { baseSplit, holder1, holder2, depositor } = await loadFixture(deployBaseSplitFixture);
      
      await baseSplit.createSplit("Deposit Test", [holder1.address, holder2.address], [50n, 50n]);
      
      const depositAmount = ethers.parseEther("1");
      await expect(baseSplit.connect(depositor).deposit(0, { value: depositAmount }))
        .to.emit(baseSplit, "FundsReceived")
        .withArgs(0, depositor.address, depositAmount);
    });

    it("Should deduct protocol fee", async function () {
      const { baseSplit, holder1, holder2, depositor } = await loadFixture(deployBaseSplitFixture);
      
      await baseSplit.createSplit("Fee Test", [holder1.address, holder2.address], [50n, 50n]);
      
      const depositAmount = ethers.parseEther("1");
      await baseSplit.connect(depositor).deposit(0, { value: depositAmount });
      
      const split = await baseSplit.splits(0);
      // 1% fee, so pending should be 0.99 ETH
      expect(split.pendingBalance).to.equal(ethers.parseEther("0.99"));
    });
  });

  describe("Distribution", function () {
    it("Should distribute funds to holders proportionally", async function () {
      const { baseSplit, holder1, holder2, depositor } = await loadFixture(deployBaseSplitFixture);
      
      await baseSplit.createSplit("Distribute Test", [holder1.address, holder2.address], [60n, 40n]);
      
      const depositAmount = ethers.parseEther("1");
      await baseSplit.connect(depositor).deposit(0, { value: depositAmount });
      
      const holder1BalanceBefore = await ethers.provider.getBalance(holder1.address);
      const holder2BalanceBefore = await ethers.provider.getBalance(holder2.address);
      
      await baseSplit.distribute(0);
      
      const holder1BalanceAfter = await ethers.provider.getBalance(holder1.address);
      const holder2BalanceAfter = await ethers.provider.getBalance(holder2.address);
      
      // 0.99 ETH after fee, split 60/40
      const expectedHolder1 = ethers.parseEther("0.594"); // 0.99 * 0.6
      const expectedHolder2 = ethers.parseEther("0.396"); // 0.99 * 0.4
      
      expect(holder1BalanceAfter - holder1BalanceBefore).to.equal(expectedHolder1);
      expect(holder2BalanceAfter - holder2BalanceBefore).to.equal(expectedHolder2);
    });

    it("Should emit FundsDistributed event", async function () {
      const { baseSplit, holder1, holder2, depositor } = await loadFixture(deployBaseSplitFixture);
      
      await baseSplit.createSplit("Event Test", [holder1.address, holder2.address], [50n, 50n]);
      
      await baseSplit.connect(depositor).deposit(0, { value: ethers.parseEther("1") });
      
      await expect(baseSplit.distribute(0))
        .to.emit(baseSplit, "FundsDistributed");
    });

    it("Should reject distribution with no pending balance", async function () {
      const { baseSplit, holder1, holder2 } = await loadFixture(deployBaseSplitFixture);
      
      await baseSplit.createSplit("Empty Test", [holder1.address, holder2.address], [50n, 50n]);
      
      await expect(baseSplit.distribute(0))
        .to.be.revertedWith("No pending balance");
    });
  });

  describe("Factory", function () {
    it("Should create new protocol", async function () {
      const { factory, owner } = await loadFixture(deployBaseSplitFixture);
      
      const fee = await factory.creationFee();
      await expect(factory.createProtocol("My Protocol", { value: fee }))
        .to.emit(factory, "SplitProtocolCreated");
      
      expect(await factory.getProtocolCount()).to.equal(1);
    });

    it("Should track protocols by creator", async function () {
      const { factory, owner } = await loadFixture(deployBaseSplitFixture);
      
      const fee = await factory.creationFee();
      await factory.createProtocol("Protocol 1", { value: fee });
      await factory.createProtocol("Protocol 2", { value: fee });
      
      const protocols = await factory.getProtocolsByCreator(owner.address);
      expect(protocols.length).to.equal(2);
    });

    it("Should reject with insufficient fee", async function () {
      const { factory } = await loadFixture(deployBaseSplitFixture);
      
      await expect(factory.createProtocol("Cheap Protocol", { value: 0 }))
        .to.be.revertedWith("Insufficient fee");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to withdraw fees", async function () {
      const { baseSplit, owner, holder1, holder2, depositor } = await loadFixture(deployBaseSplitFixture);
      
      await baseSplit.createSplit("Fee Test", [holder1.address, holder2.address], [50n, 50n]);
      await baseSplit.connect(depositor).deposit(0, { value: ethers.parseEther("1") });
      
      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
      await baseSplit.withdrawFees();
      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      
      // Should have received 0.01 ETH (1% of 1 ETH)
      expect(ownerBalanceAfter).to.be.greaterThan(ownerBalanceBefore);
    });

    it("Should allow owner to set protocol fee", async function () {
      const { baseSplit, owner } = await loadFixture(deployBaseSplitFixture);
      
      await baseSplit.setProtocolFee(200); // 2%
      expect(await baseSplit.protocolFee()).to.equal(200);
    });

    it("Should reject fee higher than 5%", async function () {
      const { baseSplit } = await loadFixture(deployBaseSplitFixture);
      
      await expect(baseSplit.setProtocolFee(600))
        .to.be.revertedWith("Fee too high");
    });
  });
});
