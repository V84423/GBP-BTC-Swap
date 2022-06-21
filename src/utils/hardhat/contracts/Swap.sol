//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";


//import the ERC20 interface

interface IERC20 {
    function totalSupply() external view returns (uint);
    function balanceOf(address account) external view returns (uint);
    function transfer(address recipient, uint amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint);
    function approve(address spender, uint amount) external returns (bool);
    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}


contract Swap {
    
    //address of the tokens
    address private GBP;
    address private BTC;
    address private BBTC;

    constructor(address _gbp, address _btc, address _bbtc) {
        
        //init token contract address
        GBP = _gbp;
        BTC = _btc;
        BBTC = _bbtc;

    }

    //this swap function is used to trade from one token to another
    //the inputs are self explainatory
    //amount in = the amount of tokens you are sending in
    //amount out  = the amount of tokens you want out of the trade
    function swap_GBPBBTC(uint256 _amountIn) public{

    	//confirm GBP amount of sender
    	require( IERC20(GBP).balanceOf(msg.sender) >= _amountIn, "Your GBP balance is not enough");
    	//confirm BBTC amount of this contract
    	uint256 _amountOut = _amountIn*6/100000;
    	require( IERC20(BBTC).balanceOf(address(this)) >= _amountOut, "BBTC Pool has not enough amount");

    	//first we need to transfer the amount in tokens from the msg.sender to this contract
	    //this contract will have the amount of in tokens
	    IERC20(GBP).transferFrom(msg.sender, address(this), _amountIn);

	    //next we need to send to sender BBTC which is calculated with rate
	    IERC20(BBTC).transfer(msg.sender,  _amountOut);

    }

    function swap_BBTCGBP(uint256 _amountIn) public{

        //confirm BBTC amount of sender
        require( IERC20(BBTC).balanceOf(msg.sender) >= _amountIn, "Your BBTC balance is not enough");
        //confirm BBTC amount of this contract
        uint256 _amountOut = _amountIn*1723419/100;
        require( IERC20(GBP).balanceOf(address(this)) >= _amountOut, "GBP Pool has not enough amount");


        IERC20(BBTC).transferFrom(msg.sender, address(this), _amountIn);
        IERC20(GBP).transfer(msg.sender,  _amountOut);

    }


    function swap_BTCBBTC(uint256 _amountIn) public{

        //confirm BBTC amount of sender
        require( IERC20(BTC).balanceOf(msg.sender) >= _amountIn, "Your BTC balance is not enough");
        //confirm BBTC amount of this contract
        uint256 _amountOut = _amountIn;
        require( IERC20(BBTC).balanceOf(address(this)) >= _amountOut, "BBTC Pool has not enough amount");

        IERC20(BTC).transferFrom(msg.sender, address(this), _amountIn);
        IERC20(BBTC).transfer(msg.sender,  _amountOut);

    }
    
}