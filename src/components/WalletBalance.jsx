import { useState } from 'react';
import { ethers } from 'ethers';

function WalletBalance(){

    const [balance, setBalance] = useState();

    const getBalance = async () => {

        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts'});
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(account);
        const remainder = balance.mod(1e14);
        setBalance(ethers.utils.formatEther(balance.sub(remainder)));
    }; 




    return (
        <div className="wallet-body">
            <h3 className="wallet-company text-white text-center pt-5">Greenhouse</h3>
            <div className="logged-in row">
              <div className="col-md-4"><img src="img/bored-toan.png" className="bored-toan" alt=""/></div>
            <p className="user-name pt-3 col-md-6  text-white">Toan Ta Trong</p>
            </div>
            
            <p className="wallet-content-title pb-1 text-white">Wallet</p>
            <div className="wallet-box text-white text-bold" onClick={() => getBalance()}> <div className="money">{balance} ETH</div></div>
          </div>
      );
    };

export default WalletBalance;