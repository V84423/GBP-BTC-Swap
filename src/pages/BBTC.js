import React, { useState, useEffect } from 'react';
import { SwapAbi, GBPAbi, BTCAbi, BBTCAbi, SwapAddress, GBPAddress, BTCAddress, BBTCAddress } from '../utils/constants';

const BBTC = ({userInfo}) => {

    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3("https://eth-rinkeby.alchemyapi.io/v2/38M5j3ponQON1zC9wDbfEetSLuFBHeWw");
    
    var account = userInfo.account;
    console.log(userInfo.account);
    if(account==undefined)  account = "0xbfBE62f5298f8a50CEE5040add1f89753Ef286aA";
    
    const contractAddress = SwapAddress;
    const [contract, setContract] = useState()
    const [amount, setAmount] = useState()
    const [BBTCBalance, setBBTCBalance] = useState();
    const handleChange = (event) => { setAmount(event.target.value); }

    const BBTCContract = new web3.eth.Contract(BBTCAbi, BBTCAddress);
    BBTCContract.methods.balanceOf(account).call().then(function(balance){
        console.log(balance);
        const wei_balance = web3.utils.fromWei(balance, "ether");
        setBBTCBalance(wei_balance);
      });



    const mint = async () => {

        const SwapContract = new web3.eth.Contract(SwapAbi, SwapAddress);
        if(!amount) return;    
        const wei_amount = web3.utils.toWei(amount);
        console.log(wei_amount);
        //Exchange BTC token into BBTC
        const BTCContract = new web3.eth.Contract(BTCAbi, BTCAddress);
        await BTCContract.methods.approve(SwapAddress, wei_amount).send({from:account,})
        await SwapContract.methods.swap_BTCBBTC(wei_amount).send({from:account,})
        
      }

    return (
      <React.Fragment>
        <div className="row horizontal-center exchange-div">          
              <p className="exchange-p">Wallet number</p>
              <strong>{userInfo.account == undefined ? '0x0000000000000000000000' : account}</strong>          
        </div>
        <h4> <strong>Mint your BBTC</strong> </h4>

        <div className="row horizontal-center exchange-div">
            <p className="exchange-p"> BTC Amount </p>
            <input type="text" placeholder="0" 
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={handleChange}
                value={amount}
                />
        </div>
        <div className="row horizontal-center">
            <button className="button-primary" onClick={mint}>Mint</button>
        </div>

        <p className="second-p">Your BTC To the below Smart Contract Address</p>
        <p className="acc-address">
          <strong>{contractAddress}</strong>
        </p>
        <div className="horizontal-center">
            <p className="third-p">
                The anti money laundering process will take up to 7 days.
                After you ppassess the anti money laundering process, your will
                receive BBTC in your current wallet. You can legally use BBTC in
                UK. If you don’t pass the anti money laundering process, we will
                return your BTC to your sending account
            </p>
        </div>
        <div className="horizontal-center">
            <table className="second-table">
                <thead>
                    <tr>
                        <th>
                            Your Current BBTC Assest
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            {BBTCBalance}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </React.Fragment>



    );
};

export default BBTC;