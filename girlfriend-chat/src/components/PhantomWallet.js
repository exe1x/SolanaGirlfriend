import React, { useEffect, useState, useCallback } from 'react';
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firebase Firestore functions
import { db } from '../firebase'; // Import Firestore instance
import { useWallet, useConnection } from '@solana/wallet-adapter-react'; // Solana wallet adapter
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'; // Solana wallet connect button
import { Transaction, PublicKey } from '@solana/web3.js'; // Solana web3 functions
import '../styles/PhantomWallet.css';
import {
    TOKEN_PROGRAM_ID,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    createTransferInstruction,
    getMint // Function to get mint info (including decimals)
} from '@solana/spl-token';

// Mint address for your SPL token
const MEMECOIN_MINT_ADDRESS = new PublicKey('A8C3xuqscfmyLrte3VmTqrAq8kgMASius9AFNANwpump');

// Store Wallet Address (the wallet where the SPL token will be sent)
const STORE_WALLET_ADDRESS = new PublicKey('11111111111111111111111111111111');

const PhantomWallet = ({ walletAddress, setWalletAddress, balance, setBalance }) => {
    const { publicKey, sendTransaction } = useWallet(); // Get the connected wallet public key and sendTransaction method
    const { connection } = useConnection(); // Get the connection to the Solana network
    const [transactionStatus, setTransactionStatus] = useState(null); // To show transaction status
    const [decimals, setDecimals] = useState(0); // Store the token's decimal precision
    const [infoVisible, setInfoVisible] = useState(false); // State to toggle info dialog

    // Function to fetch token decimals
    const fetchTokenDecimals = useCallback(async () => {
        try {
            const mintInfo = await getMint(connection, MEMECOIN_MINT_ADDRESS); // Get mint info for the token
            setDecimals(mintInfo.decimals); // Set the decimals of the token
        } catch (error) {
            console.error('Error fetching token decimals:', error);
        }
    }, [connection]);

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

    const sendSplTokenToStore = async () => {
        if (!publicKey) return;

        try {
            // Get the user's associated token account for the SPL token
            const userTokenAccount = await getAssociatedTokenAddress(
                MEMECOIN_MINT_ADDRESS,
                publicKey
            );

            // Get or create the store's associated token account
            const storeTokenAccount = await getAssociatedTokenAddress(
                MEMECOIN_MINT_ADDRESS,
                STORE_WALLET_ADDRESS
            );

            // Create a transaction to send SPL tokens
            const transaction = new Transaction();

            // Check if the store token account exists, if not, create it
            const storeAccountInfo = await connection.getAccountInfo(storeTokenAccount);
            if (!storeAccountInfo) {
                transaction.add(
                    createAssociatedTokenAccountInstruction(
                        publicKey, // Payer
                        storeTokenAccount, // The associated token account to create
                        STORE_WALLET_ADDRESS, // The owner of the associated token account
                        MEMECOIN_MINT_ADDRESS // Mint of the token
                    )
                );
            }

            // Specify the human-readable amount you want to transfer (e.g., 10 tokens)
            const humanReadableAmount = 1;

            // Adjust for decimals
            const tokenAmount = humanReadableAmount * Math.pow(10, decimals); // 10 tokens adjusted for decimals

            // Add the transfer instruction to send tokens to the store
            transaction.add(
                createTransferInstruction(
                    userTokenAccount, // Source token account (user's token account)
                    storeTokenAccount, // Destination token account (store's token account)
                    publicKey, // Owner of the source account
                    tokenAmount, // Amount to transfer, adjusted for decimals
                    [], // Signers (if any)
                    TOKEN_PROGRAM_ID // Token program ID
                )
            );

            // Send the transaction and get the signature
            const signature = await sendTransaction(transaction, connection);

            // Wait for confirmation manually
            let confirmed = false;
            while (!confirmed) {
                const response = await connection.getSignatureStatus(signature);
                if (response?.value?.confirmationStatus === 'finalized') {
                    confirmed = true;
                }
            }

            // Once the transaction is confirmed, show the transaction URL in Solscan
            const solscanUrl = `https://solscan.io/tx/${signature}`;
            // Update transaction status
            setTransactionStatus(
                <span>
                    Transaction successful! View on <a href={solscanUrl} target="_blank" rel="noopener noreferrer">Solscan</a>.
                </span>
            );

            // Increment the balance by 1 in Firestore
            if (walletAddress) {
                const userRef = doc(db, 'users', walletAddress);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const currentBalance = userSnap.data().balance || 0;
                    const newBalance = currentBalance + 1; // Increment balance by 1
                    await setDoc(userRef, { balance: newBalance }, { merge: true }); // Update the balance in Firestore
                    setBalance(newBalance); // Update local balance state
                }
            }
        } catch (error) {
            console.error('Error sending SPL token:', error);
            setTransactionStatus('Transaction failed: ' + error.message);
        }
    };

    const toggleInfo = () => {
        setInfoVisible(!infoVisible); // Toggle visibility of the dialog
    };

    // Effect to trigger Firebase fetch when wallet is connected
    useEffect(() => {
        if (publicKey) {
            setWalletAddress(publicKey.toString()); // Set wallet address
            fetchOrCreateUserInFirebase(publicKey.toString()); // Fetch or create Firebase user
            fetchTokenDecimals(); // Fetch the token's decimal precision
        }
    }, [publicKey, fetchTokenDecimals]);

    return (
        <div>
            <div className="wallet-and-transaction-buttons">
                <WalletMultiButton /> {/* The button to connect the wallet */}
                <button 
                    onClick={sendSplTokenToStore} 
                    className="transaction-button"
                    disabled={!walletAddress} // Disable if no wallet is connected
                >
                    {walletAddress ? "Send 100 $GF For 1 Chat Credit" : "Select a Wallet to Buy"} {/* Conditional text */}
                </button>
                <button onClick={toggleInfo} className="info-button">Info</button> {/* Button to show info */}
            </div>

            {infoVisible && (
                <div className="dialog-overlay">
                    <div className="dialog">
                        <h2>Welcome to $GF!</h2>
                        <p>The first AI girlfriend powered by $GF tokens. Every purchase burns the $GF token.</p>
                        <p>Follow us on <a href="https://x.com/AISolMate" target="_blank" rel="noopener noreferrer">X</a> for updates!</p>
                        <p>Join Our <a href="https://t.me/AISolMatePortal" target="_blank" rel="noopener noreferrer">Telegram</a></p>
                        <button onClick={toggleInfo} className="close-dialog-button">Close</button>
                    </div>
                </div>
            )}

<p className="info-text">Every purchase will burn the $GF token.</p>

            {walletAddress && (
                <div>
                    <p>Balance: {balance !== null ? `${balance} Credits` : 'Loading balance...'}</p>
                    {transactionStatus && <p>{transactionStatus}</p>} {/* Show transaction status */}
                </div>
            )}
        </div>
    );
};

export default PhantomWallet;
