const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Marketplace", () => {
  let marketplace
  let deployer, buyer

  beforeEach(async () => {
    [deployer, buyer] = await ethers.getSigners();
    console.log(deployer, buyer);

    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy();
  })

  describe("Deployment", () => {
    it("Sets the owner", async () => {
      expect(await marketplace.owner()).to.equal(deployer.address);
    })
  })

})
