const { expect } = require("chai");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
};

describe("Marketplace", () => {
  let marketplace;
  let deployer, buyer;

  beforeEach(async () => {
    [deployer, buyer] = await ethers.getSigners();
    console.log(deployer, buyer);

    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy();
  });

  describe("Deployment", () => {
    it("Sets the owner", async () => {
      expect(await marketplace.owner()).to.equal(deployer.address)
    });
  });

  describe("Listing", () => {
    let transaction;

    beforeEach(async () => {
      transaction = await marketplace.connect(deployer).listProducts(
        1,
        "Book",
        "Crime",
        "IMAGE",
        100,
        5,
        10
      );
      await transaction.wait();
    })

    it("Returns item attributes", async () => {
      const item = await marketplace.items(1);
      expect(item.id).to.equal(1);
    });
  });

})
