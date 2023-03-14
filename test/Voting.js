const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting", function () {
  let deployer, account1;
  const testProposal1 = ethers.utils.formatBytes32String("Go hard");
  const testProposal2 = ethers.utils.formatBytes32String("Go Home");

  beforeEach(async function () {
    [deployer, account1] = await ethers.getSigners();

    const Ballot = await ethers.getContractFactory("Voting", deployer);
    this.ballot = await Ballot.deploy([testProposal1, testProposal2]);
  });

  it("should set a list of proposals at deployment", async function () {
    const proposalsLength = ethers.BigNumber.from(
      await ethers.provider.getStorageAt(this.ballot.address, 2)
    );
    expect(proposalsLength.eq(2)).to.equal(true);
  });
});
