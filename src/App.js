import "./assets/css/normalize.css";
import "./assets/css/skeleton.css";
import "./assets/css/style.css";

import Web3 from 'web3';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Service from "./pages/service";
import Exchange from "./pages/exchange";
import BBTC from "./pages/BBTC";


function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [rate, setRate] = useState({});
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    function checkConnectedWallet() {
      const userData = JSON.parse(localStorage.getItem('userAccount'));
      if (userData != null) {
        setUserInfo(userData);
        // console.log(userData);
        setIsConnected(true);
      }
    }
    checkConnectedWallet();
    setRate({
      'GBPBTC':0.00006,
      'BTCGBP':17234.19
    });
  }, []);

  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      // eslint-disable-next-line
      provider = window.web3.currentProvider;
    } else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
    return provider;
  };

  const onConnect = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        if (currentProvider !== window.ethereum) {
          console.log(
            'Non-Ethereum browser detected. You should consider trying MetaMask!'
          );
        }
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const chainId = await web3.eth.getChainId();
        const account = userAccount[0];
        let ethBalance = await web3.eth.getBalance(account); // Get wallet balance
        ethBalance = web3.utils.fromWei(ethBalance, 'ether'); //Convert balance to wei
        saveUserInfo(ethBalance, account, chainId);
        if (userAccount.length === 0) {
          console.log('Please connect to meta mask');
        }
      }
    } catch (err) {
      console.log(
        'There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.'
      );
    }
  };

  const onDisconnect = () => {
    window.localStorage.removeItem('userAccount');
    setUserInfo({});
    setIsConnected(false);
  };

  const saveUserInfo = (ethBalance, account, chainId) => {
    const userAccount = {
      account: account,
      balance: ethBalance,
      connectionid: chainId,
    };
    window.localStorage.setItem('userAccount', JSON.stringify(userAccount)); //user persisted data
    const userData = JSON.parse(localStorage.getItem('userAccount'));
    setUserInfo(userData);
    setIsConnected(true);
  };

  return (

    <div>
        <div className="container">
            <div className="content">
                <div className="row nav horizontal-center vertical-center first">
                  <a href = "/"><img src={require('./assets/imgs/arrow.svg').default} alt="svg" /></a>
                    <span className="net-status">
                        Network status : {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                    {
                      isConnected ? <button className="sign-out" onClick={ onDisconnect } > Sign Out </button> : 
                                    <button className="sign-in" onClick={ onConnect } > Sign In </button>
                    }
                    
                </div>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Service  userInfo={userInfo} />} />
                    <Route path="exchange" element={<Exchange userInfo={userInfo} rate={rate} />} />
                    <Route path="BBTC" element={<BBTC  userInfo={userInfo} />} />                    
                  </Routes>
                </BrowserRouter>                
            </div>
        </div>
    </div>     

  );
}

export default App;