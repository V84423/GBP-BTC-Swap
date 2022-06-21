//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title SampleERC20
 * @dev Create a sample ERC20 standard token
 */
contract BBTC is ERC20 {

    // Variable that maintains 
    // owner address
    address private _owner;

    constructor() public ERC20("BBTC Token", "BBTC") {
        // Sets the original owner of 
        // contract when it is deployed
        _owner = msg.sender;

        //initial mint BBTC token
        _mint(_owner, 1000*1e18);
    }

    // onlyOwner modifier that validates only 
    // if caller of function is contract owner, 
    // otherwise not
    modifier onlyOwner() 
    {
        require(isOwner(),
        "Function accessible only by the owner !!");
        _;
    }
  
    // function for owners to verify their ownership. 
    // Returns true for owners otherwise false
    function isOwner() public view returns(bool) 
    {
        return msg.sender == _owner;
    }


    function mint(address account, uint256 amount) public onlyOwner {

       _mint(account, amount);

    }

}
