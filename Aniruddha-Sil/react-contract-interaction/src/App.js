import './App.css';
import { ethers } from 'ethers';
import HelloWorld from './ABI/HelloWorld.json';
import { useState,  useEffect, useMemo } from 'react';

const helloWorldContractAddress = '0xeD22F04a18Ce3FCe03949e1e95DFe14735c370a0';

function App() {

  const [inputMessage, setInputMessage] = useState('');
  const [txnHash,setTxnHash] = useState('');
  const [message,setMessage] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const address = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Connected', address);
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log('Install MetaMask');
    }
  }


  const { signer, contract} = useMemo(() => {
    if(window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(helloWorldContractAddress, HelloWorld.abi, signer)

      return {
        provider,
        signer,
        contract
      }
    }
  },[])
    
  const updateMessage = async (message) => {
    if (window.ethereum) {
      if(await signer.getChainId() !== 80001) return alert('Please connect to Mumbai Testnet');
      try {
        const transaction = await contract.update(message);
        setTxnHash(transaction.hash);
        await transaction.wait();
        console.log('Message updated!');
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log('window.etherum not found');
    }
  }

 

  useEffect(() => {
    const getMessage = async () => {
      if (window.ethereum) {
        try {
          const message = await contract.message();
          setMessage(message);
        } catch (err) {
          console.log(err);
        }
      }
    }

    getMessage();
  },[contract])
  


  return (
    <div className="App">
      <button
       onClick={connectWallet}
      >
        Connect Wallet
      </button>
      <div>
        <h1>Update Message</h1>
        <input onChange={(e) => setInputMessage(e?.target?.value)} />
        <button onClick={() => updateMessage(inputMessage)}>Update Message</button>
      </div>
      <h1>Update message txn hash: {txnHash}</h1>
      <h1>Message currently in contract: {message}</h1>
    </div>
  );
}

export default App;
