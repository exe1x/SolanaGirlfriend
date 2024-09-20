import React, { useState } from 'react';
import '../styles/PhantomWallet.css';

const PhantomWallet = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  // Function to connect to the Phantom Wallet
  const connectPhantomWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        // Forcefully disconnect first, if already connected
        window.solana.disconnect();

        // Request to connect the wallet, this will trigger the prompt
        const response = await window.solana.connect();
        console.log("Connected with public key:", response.publicKey.toString());
        setWalletAddress(response.publicKey.toString());
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      // Phantom Wallet is not installed
      alert("Phantom Wallet is not installed. Please install the Phantom extension.");
      window.open('https://phantom.app/', '_blank'); // Redirect to Phantom website
    }
  };

  return (
    <div className="wallet-connection">
      {!walletAddress ? (
        <button onClick={connectPhantomWallet}>Connect Phantom Wallet</button>
      ) : (
        <p>Connected Wallet: {walletAddress}</p>
      )}
    </div>
  );
};

export default PhantomWallet;

