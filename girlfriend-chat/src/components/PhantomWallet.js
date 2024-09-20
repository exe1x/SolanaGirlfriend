import React, { useState } from 'react';
import '../styles/PhantomWallet.css';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBt5hibVydYU1-XRvy6xm8HqAFCjypCDPM",
  authDomain: "dogwifblog-b2997.firebaseapp.com",
  projectId: "dogwifblog-b2997",
  storageBucket: "dogwifblog-b2997.appspot.com",
  messagingSenderId: "293268586075",
  appId: "1:293268586075:web:6e1230b209ded0495b097e",
  measurementId: "G-R16VCZJ5XC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const PhantomWallet = ({ walletAddress, setWalletAddress, balance, setBalance }) => {

  // Function to fetch the balance from Firebase
  const fetchBalance = async (publicKey) => {
    try {
      const userRef = doc(db, "users", publicKey);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setBalance(userSnap.data().balance); // Update balance in state
      } else {
        console.error('User does not exist in Firebase');
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  // Function to store or fetch the user data in Firebase
  const storeUserInFirebase = async (publicKey) => {
    try {
      const userRef = doc(db, "users", publicKey);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        // If user doesn't exist, create a new user with an initial balance
        await setDoc(userRef, { walletID: publicKey, balance: 10 });
        setBalance(10); // Set initial balance in state
        console.log("New user created in Firebase");
      } else {
        // If user exists, fetch their balance
        fetchBalance(publicKey); // Call fetchBalance to update state with balance
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
          <p>Balance: {balance} Tokens</p>
        </div>
      )}
    </div>
  );
};

export default PhantomWallet;