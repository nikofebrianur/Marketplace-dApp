// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Marketplace {
    // define owner
    address public owner;

    struct Item {
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    struct Order {
        uint256 time;
        Item item;
    }

    mapping(uint256 => Item) public items;
    mapping(address => uint256) public orderCounts;
    mapping(address => mapping(uint256 => Order)) public orders;

    event ListProducts(
        string name,
        uint256 cost,
        uint256 quantity
    );

    event BuyProducts(
        address buyer,
        uint256 orderId,
        uint256 itemId
    );

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // list products
    function listProducts(
        uint256 _id,
        string memory _name,
        string memory _category,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock
    ) public onlyOwner {
        // create item struct
        Item memory item = Item(
            _id,
            _name,
            _category,
            _image,
            _cost,
            _rating,
            _stock
        );
        // save item struct to blockchain
        items[_id] = item;
        // emit event
        emit ListProducts(_name, _cost, _stock);
    }
    // buy products
    function buyProducts(uint256 _id) public payable {
        Item memory item = items[_id];
        require(msg.value >= item.cost);
        require(item.stock > 0);
        
        Order memory order = Order(block.timestamp, item);
        orderCounts[msg.sender]++;
        orders[msg.sender][orderCounts[msg.sender]] = order;
        items[_id].stock = item.stock - 1;
        emit BuyProducts(msg.sender, orderCounts[msg.sender], item.id);
    }

    // withdraw funds
}
