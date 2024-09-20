import React, { useEffect } from 'react';
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firebase Firestore functions
import { db } from '../firebase'; // Import Firestore instance
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'; // Wallet button from Solana wallet adapter

const PhantomWallet = ({ walletAddress, setWalletAddress, balance, setBalance }) => {

  // Function to fetch or create user in Firebase
  const fetchOrCreateUserInFirebase = async (publicKey) => {
    try {
      const userRef = doc(db, 'users', publicKey);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setBalance(userSnap.data().balance); // Set balance from Firebase
      } else {
        // If user doesn't exist, create with default balance
        const defaultBalance = 10;
        await setDoc(userRef, { walletID: publicKey, balance: defaultBalance });
        setBalance(defaultBalance);
      }
    } catch (error) {
      console.error("Error fetching or creating user in Firebase:", error);
    }
  };

  // Effect to trigger Firebase fetch on wallet connection
  useEffect(() => {
    if (walletAddress) {
      fetchOrCreateUserInFirebase(walletAddress);
    }
  }, [walletAddress]);

  // Simulated Wallet connection function
  const connectWallet = () => {
    const mockWalletAddress = "MockWalletAddress123"; // Simulate a wallet address
    setWalletAddress(mockWalletAddress);
  };

  return (
    <div>
      <WalletMultiButton /> {/* The button to connect the wallet */}
      <button onClick={connectWallet}>Simulate Wallet Connection</button>
      {walletAddress && (
        <div>
          <p>Connected Wallet: {walletAddress}</p>
          <p>Balance: {balance !== null ? `${balance} Credits` : 'Loading balance...'}</p>
        </div>
      )}
    </div>
  );
};

export default PhantomWallet;
