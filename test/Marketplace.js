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

  describe("Buying", () => {
    let transaction;

    const ID = 1;
    const NAME = "Book";
    const CATEGORY = "Crime";
    const IMAGE = "https://ipfs.io";
    const COST = tokens(1);
    const RATING = 5;
    const STOCK = 10;

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

    it("Update the buyer's order count", async () => {
      const result = await marketplace.orderCounts(buyer.address);
      expect(result).to.equal(1);
    });

    it("Adds the order", async () => {
      const order = await marketplace.orders(buyer.address, 1);
      expect(order.time).to.be.greaterThan(0);
      expect(order.item.name).to.equal(NAME);
    });

    it("Emit BuyProducts event", async () => {
      expect(transaction).to.emit(marketplace, "BuyProducts");
    });
  });

  describe("Withdrawing", () => {
    let balanceBefore;

    const ID = 1;
    const NAME = "Book";
    const CATEGORY = "Crime";
    const IMAGE = "https://ipfs.io/(URL_ITEM_IMAGE_IN_IPFS)";
    const COST = tokens(1);
    const RATING = 5;
    const STOCK = 10;

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

      // get deployer balance before
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      // withdraw 
      transaction = await marketplace.connect(deployer).withdraw()
      await transaction.wait();
    })

    it("Update the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("Update the contract balance", async () => {
      const result = await ethers.provider.getBalance(marketplace.address);
      expect(result).to.equal(0);
    });
  });
})