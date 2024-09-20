import React, { useState } from 'react';
import axios from 'axios';  // Import Axios for making API requests
import '../styles/PhantomWallet.css';
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { db } from '../firebase'; // Import Firestore instance from firebase.js

// Add your Moralis API Key here
const MORALIS_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjkxNzVhZTMzLWFkNWMtNDNhNy1hYWM2LWNlMDc4YThiYjNhMyIsIm9yZ0lkIjoiNDA4ODk1IiwidXNlcklkIjoiNDIwMTY4IiwidHlwZUlkIjoiNzc3ZGE2YzAtY2VjYy00Y2Y5LWFjYTItMGNiZjVlZmIwYjUxIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MjY4MDAzNjksImV4cCI6NDg4MjU2MDM2OX0.T2v5aDHsmuQCbxgfaox_FNBjyGAxz16mG7DbZ57dO_4';  // Replace with your Moralis API Key

const PhantomWallet = ({ walletAddress, setWalletAddress, balance, setBalance }) => {
  const [solBalance, setSolBalance] = useState(null); // Add state for SOL balance

  // Function to fetch the SOL balance using Axios (Moralis API)
  const fetchSolBalance = async (publicKey) => {
    try {
      const response = await axios.get(`https://solana-gateway.moralis.io/account/mainnet/${publicKey}/balance`, {
        headers: {
          'accept': 'application/json',
          'X-API-Key': MORALIS_API_KEY
        }
      });
      const balanceLamports = response.data.solana; // Balance is in lamports
      setSolBalance(balanceLamports / 1); // Convert lamports to SOL (1 SOL = 1 billion lamports)
    } catch (error) {
      console.error('Error fetching SOL balance:', error);
    }
  };

  // Function to fetch the token balance from Firebase
  const fetchTokenBalance = async (publicKey) => {
    try {
      const userRef = doc(db, "users", publicKey);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setBalance(userSnap.data().balance); // Update token balance in state
      } else {
        console.error('User does not exist in Firebase');
      }
    } catch (error) {
      console.error('Error fetching token balance:', error);
    }
  };

  // Function to store or fetch the user data in Firebase
  const storeUserInFirebase = async (publicKey) => {
    try {
      const userRef = doc(db, "users", publicKey);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        // If user doesn't exist, create a new user with an initial balance
        await setDoc(userRef, { walletID: publicKey, balance: 1000 });
        setBalance(10); // Set initial balance in state
        console.log("New user created in Firebase");
      } else {
        // If user exists, fetch their balance
        fetchTokenBalance(publicKey); // Call fetchTokenBalance to update state with balance
      }
    } catch (error) {
      console.error("Error storing user in Firebase:", error);
    }
  };

  // Function to connect to the Phantom Wallet
  const connectPhantomWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        // Disconnect the wallet first (if already connected)
        window.solana.disconnect();

        // Request to connect the wallet (this will trigger the Phantom prompt)
        const response = await window.solana.connect();
        console.log("Connected with public key:", response.publicKey.toString());

        const publicKey = response.publicKey.toString();
        setWalletAddress(publicKey); // Set wallet address in state

        // Fetch the SOL balance using the Moralis API
        //fetchSolBalance(publicKey);

        // Store or update the user in Firebase
        storeUserInFirebase(publicKey);
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      // If Phantom Wallet is not installed
      alert("Phantom Wallet is not installed. Please install the Phantom extension.");
      window.open('https://phantom.app/', '_blank'); // Redirect to Phantom website
    }
  };

  return (
    <div className="wallet-connection">
      {!walletAddress ? (
        <button onClick={connectPhantomWallet}>Connect Phantom Wallet</button>
      ) : (
        <div>
          <p>Connected Wallet: {walletAddress}</p>
          <p>SOL Balance: {solBalance !== null ? `${solBalance} SOL` : 'Loading SOL balance...'}</p> {/* Display SOL balance */}
          <p>Token Balance: {balance !== null ? `${balance} Tokens` : 'Loading token balance...'}</p> {/* Display Firebase token balance */}
        </div>
      )}
    </div>
  );
};

export default PhantomWallet;
