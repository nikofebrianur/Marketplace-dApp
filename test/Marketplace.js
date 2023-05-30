const { expect } = require("chai");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
};

describe("Marketplace", () => {
  let marketplace;
  let deployer, buyer;

  beforeEach(async () => {
    [deployer, buyer] = await ethers.getSigners();

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

    const ID = 1;
    const NAME = "Book";
    const CATEGORY = "Crime";
    const IMAGE = "https://ipfs.io";
    const COST = tokens(1);
    const RATING = 5;
    const STOCK = 10;

    beforeEach(async () => {
      transaction = await marketplace.connect(deployer).listProducts(
        ID,
        NAME,
        CATEGORY,
        IMAGE,
        COST,
        RATING,
        STOCK
      );
      await transaction.wait();
    })

    it("Returns item attributes", async () => {
      const item = await marketplace.items(ID);
      expect(item.id).to.equal(ID);
      expect(item.name).to.equal(NAME);
      expect(item.category).to.equal(CATEGORY);
      expect(item.image).to.equal(IMAGE);
      expect(item.cost).to.equal(COST);
      expect(item.stock).to.equal(STOCK);
    });

    it("Emit ListProducts event", async () => {
      expect(transaction).to.emit(marketplace, "ListProducts");
    });
  });

  describe("Listing", () => {
    let transaction;

    beforeEach(async () => {
      // list an item
      transaction = await marketplace.connect(deployer).listProducts(
        ID,
        NAME,
        CATEGORY,
        IMAGE,
        COST,
        RATING,
        STOCK
      );
      await transaction.wait();

      // buy an item
      transaction = await marketplace.connect(buyer).buyProducts(ID, { value: COST });
    })

    it("Update the contract balance", async () => {
      const result = await ethers.provider.getBalance(marketplace.address);
      expect(result).to.equal(COST);
    });
  });
});