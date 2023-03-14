const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting", function () {
  let deployer, account1;
  const testProposal1 = ethers.utils.formatBytes32String("Go hard");
  const testProposal2 = ethers.utils.formatBytes32String("Go Home");

  beforeEach(async function () {
    [deployer, attacker, voter1] = await ethers.getSigners();

    const Ballot = await ethers.getContractFactory("Voting", deployer);
    this.ballot = await Ballot.deploy([testProposal1, testProposal2]);
  });

  it("should set a list of proposals at deployment", async function () {
    const proposalsLength = ethers.BigNumber.from(
      await ethers.provider.getStorageAt(this.ballot.address, 2)
    );
    expect(proposalsLength.eq(2)).to.equal(true);
  });

  it("should set the deployer account as the chairperson at deployment", async function () {
    expect(await this.ballot.chairperson()).to.equal(deployer.address);
  });

  it("should be impossible for anyone asides the chairperson to assign voting rights", async function () {
    await expect(
      this.ballot.connect(attacker).giveRightToVote(voter1.address)
    ).to.be.revertedWith("Only chairperson can give right to vote.");
  });
});
