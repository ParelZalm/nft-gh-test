import WalletBalance from './WalletBalance';
import { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import GHTest from '../artifacts/contracts/MyNFT.sol/GHTest.json';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, GHTest.abi, signer);

function Home() {

    const [totalMinted, setTotalMinted] = useState(0);
    useEffect(() => {
      getCount();
    }, []);
  
    const getCount = async () => {
      const count = await contract.count();
      console.log(parseInt(count));
      setTotalMinted(parseInt(count));
    };
  
    return (
      <div>
        <WalletBalance />
  
        <h4 className="nft-title pt-5 pb-3">Collection</h4>
        <div className="container nft-collection">
          <div className="row">
            {Array(totalMinted + 1)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="col-sm-4 pb-3">
                  <NFTImage tokenId={i} getCount={getCount} />
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
  
  function NFTImage({ tokenId, getCount }) {
    const contentId = 'QmcDxsDrPw3abDbzPAW3R738MHEfS2HLeRcdTub6LgL4pi';
    const metadataURI = `${contentId}/${tokenId}.json`;
    const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;
  //   const imageURI = `img/${tokenId}.png`;
  
    const [isMinted, setIsMinted] = useState(false);
    useEffect(() => {
      getMintedStatus();
    }, [isMinted]);
  
    const getMintedStatus = async () => {
      const result = await contract.isContentOwned(metadataURI);
      console.log(result)
      setIsMinted(result);
    };
  
    const mintToken = async () => {
      const connection = contract.connect(signer);
      const addr = connection.address;
      const result = await contract.payToMint(addr, metadataURI, {
        value: ethers.utils.parseEther('0.05'),
      });
  
      await result.wait();
      getMintedStatus();
      getCount();
    };
  
    async function getURI() {
      // ipfs://QmcDxsDrPw3abDbzPAW3R738MHEfS2HLeRcdTub6LgL4pi/0.json
      // https://gateway.pinata.cloud/ipfs/QmcDxsDrPw3abDbzPAW3R738MHEfS2HLeRcdTub6LgL4pi/0.json
      const uri = await contract.tokenURI(tokenId);
      const smol = uri.split(":/").pop();
      const linkstart = "https://gateway.pinata.cloud/ipfs"
      const linkuri = linkstart.concat(smol)
      // read json on ipfs
      fetch(linkuri)
      .then(res => res.json())
      .then((out) => {
          console.log(out.name);
          document.querySelector(".token-name-" + tokenId +"").innerHTML = out.name;
        })
          .catch(err => { throw err });
        }
    return (
      <div className="card">
        <img className="card-img-top" src={isMinted ? imageURI : 'img/placeholder.png'}></img>
        <div className="card-body">
          <p className={["card-title text-center token-name-", tokenId].join("")}>ID #{tokenId}</p>
          {!isMinted ? (
            <p className="text-left clickable" onClick={mintToken}>
              Mint
            </p>
          ) : (
            <p className="text-left clickable" onClick={getURI}>
              NFT name
            </p>
          )}
        </div>
      </div>
    );
  }
  
  export default Home;