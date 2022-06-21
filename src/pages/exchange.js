import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { SwapAbi, GBPAbi, BTCAbi, BBTCAbi, SwapAddress, GBPAddress, BTCAddress, BBTCAddress } from '../utils/constants';
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

const Exchange = ({userInfo, rate}) => {

  var account = userInfo.account;
  console.log(userInfo.account);
  if(account==undefined)  account = "0xbfBE62f5298f8a50CEE5040add1f89753Ef286aA";

  const web3 = createAlchemyWeb3("https://eth-rinkeby.alchemyapi.io/v2/38M5j3ponQON1zC9wDbfEetSLuFBHeWw");
  const [GBPBalance, setGBPBalance] = useState();
  const [BBTCBalance, setBBTCBalance] = useState();
  const [contractBalance, setContractBalance] = useState();
  const [curTo, setCurTo] = useState("BBTC");
  const [curFrom, setCurFrom] = useState("GBP");
  const [amountTo, setAmountTo] = useState();
  const [amountFrom, setAmountFrom] = useState();

  const handleChangeTo = (event) => {

    setCurTo(event.target.value)
    if(event.target.value == "GBP"){
     setCurFrom("BBTC")
     setAmountFrom(amountTo)
     setAmountTo(amountFrom)
   }
    else if(event.target.value == "BBTC"){
     setCurFrom("GBP")
     setAmountFrom(amountTo)
     setAmountTo(amountFrom)
   }
  }

  const handleChangeFrom = (event) => {
    setCurFrom(event.target.value)
    if(event.target.value == "GBP") {
      setCurTo("BBTC")
      setAmountFrom(amountTo)
      setAmountTo(amountFrom)
    }
    else if(event.target.value == "BBTC") {
      setCurTo("GBP")
      setAmountFrom(amountTo)
      setAmountTo(amountFrom)
    }
  }
  
  const handleChangeBalTo = (event) => {

    setAmountTo(event.target.value) 
    if(curTo == "GBP") setAmountFrom(event.target.value*rate.GBPBTC)
    else if(curTo == "BBTC") setAmountFrom(event.target.value*rate.BTCGBP)
  }

  const handleChangeBalFrom = (event) => {
    
    setAmountFrom(event.target.value)
    if(curFrom == "GBP") setAmountTo(event.target.value*rate.GBPBTC)
    else if(curFrom == "BBTC") setAmountTo(event.target.value*rate.BTCGBP)
  }

  const GBPContract = new web3.eth.Contract(GBPAbi, GBPAddress);
  GBPContract.methods.balanceOf(account).call().then(function(balance){
    const wei_GBPBalance = web3.utils.fromWei(balance, "ether");
    console.log("GBP :"+wei_GBPBalance);
    setGBPBalance(wei_GBPBalance);
  });
  

  const BBTCContract = new web3.eth.Contract(BBTCAbi, BBTCAddress)  

  BBTCContract.methods.balanceOf(account).call().then(function(balance){
    const wei_BBTCBalance = web3.utils.fromWei(balance, "ether");
    console.log("BBTC :"+wei_BBTCBalance);
    setBBTCBalance(wei_BBTCBalance);
  });

  BBTCContract.methods.balanceOf(SwapAddress).call().then(function(balance){
    const wei_contractBalance = web3.utils.fromWei(balance, "ether");
    console.log("Contract's BBTC :"+wei_contractBalance);
    setContractBalance(wei_contractBalance);
  });

  
  
  const curExchange = async () => {

    const SwapContract = new web3.eth.Contract(SwapAbi, SwapAddress);
    if(!amountFrom) return;    
    
    const wei_amount = web3.utils.toWei(amountFrom);
    console.log(wei_amount);

    if(curFrom == "GBP"){        
        //Exchange GBP token into BBTC
        await GBPContract.methods.approve(SwapAddress, wei_amount).send({from:account,})
        await SwapContract.methods.swap_GBPBBTC(wei_amount).send({from:account,})
    }else if(curFrom == "BBTC"){

        //Exchange BBTC token into GBP
        await BBTCContract.methods.approve(SwapAddress, wei_amount).send({from:account,})
        await SwapContract.methods.swap_BBTCGBP(wei_amount).send({from:account,})
    }else return;
  }


  return (
    <React.Fragment>
      <div className="row vertical-center horizontal-center third">
          <img src={require('../assets/imgs/user.svg').default} alt="svg" />
          <h3 className="username">John Lee</h3>
      </div>
      <div className="row vertical-center horizontal-center">
          <div className="col">
              <p className="wallet-nb">Wallet number</p>
              <strong>{userInfo.account == undefined ? '0x0000000000000000000000' : account}</strong>
          </div>
      </div>
      <div className="row vertical-center horizontal-center">
          <div className="cus-row">
              <div className="balance">
                  <img src={require('../assets/imgs/currency.svg').default} alt="svg" />
                  <p>Balance</p>
              </div>
              <strong>£ {GBPBalance}</strong>
          </div>
      </div>

      <h4><strong>Exchange Rate: {rate.BTCGBP}</strong></h4>
      <p className="second-p">BBTC Pool Balance: {contractBalance}</p>

      <hr />
      <div className="row  horizontal-center">
          <div className="pay-to">
              <label htmlFor="pay">From</label>
              <div className="vertical-center">
                  <div className="columns four">
                      <select name="" id="" onChange={handleChangeFrom} value={curFrom}>
                          <option value="BBTC">BBTC</option>
                          <option value="GBP">GBP</option>
                          <option value="BOND">BOND</option>
                      </select>
                  </div>
                  <div className="columns eight">
                      <input type="text" placeholder="0" 
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        onChange={handleChangeBalFrom}
                        value={amountFrom}
                      />
                  </div>
              </div>
          </div>
      </div>
      <div className="row  horizontal-center">
          <div className="pay-to">
              <label htmlFor="pay">To</label>
              <div className="vertical-center">
                  <div className="columns four">
                      <select name="" id="" onChange={handleChangeTo} value={curTo}>
                          <option value="BBTC">BBTC</option>
                          <option value="GBP">GBP</option>
                          <option value="BOND">BOND</option>
                      </select>
                  </div>
                  <div className="columns eight">
                      <input type="text" placeholder="0" 
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        onChange={handleChangeBalTo}
                        value={amountTo}
                       />
                  </div>
              </div>
          </div>
      </div>
      <div className="row horizontal-center">
          <button className="button-primary" onClick={curExchange}>Exchange</button>
      </div>
      <hr />
      <div className="horizontal-center">
          <table className="" >
              <thead>
                  <tr>
                      <th colSpan="2" >My assests</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>GPB: </td>
                      <td className="second-tds">{GBPBalance}</td>
                  </tr>
                  <tr>
                      <td>BBTC:</td>
                      <td className="second-tds">{BBTCBalance}</td>
                  </tr>
              </tbody>
          </table>
      </div>
    </React.Fragment>
  );
};

export default Exchange;