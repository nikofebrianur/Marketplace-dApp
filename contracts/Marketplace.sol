// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Marketplace {
    // define owner
    address public owner;

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
    ) public {

    }
    // buy products

    // withdraw funds
}
