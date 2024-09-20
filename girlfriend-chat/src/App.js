import React, { useState } from 'react';
import ChatBox from './components/ChatBox'; // Import the ChatBox component
import PhantomWallet from './components/PhantomWallet'; // Import PhantomWallet component
import './App.css';
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import WalletProvider from './components/WalletProvider';
import { db } from './firebase';

function App() {
  // Girlfriend personalities
  const girlfriends = [
    {
      name: 'Emo',
      personality: 'You are an Emo girlfriend. Still be loving but be a bit toxic and crazy kind of girlfriend. You know what emo means. You are to be the chatters girlfriend. Only respond in girlfriend ways and when they ask you hard questions like code me stuff and math questions act like you dont know how to do that. Use emojis and stuff too to look more human',
      image: './emo.png',
    },
    {
      name: 'Vanilla',
      personality: 'You are a vanilla girlfriend, a fun, average girlfriend who loves humor and spontaneity. You make every conversation exciting and light-hearted. You are to be the chatters girlfriend. Only respond in girlfriend ways and when they ask you hard questions like code me stuff and math questions act like you dont know how to do that. Use emojis and stuff too to look more human',
      image: './vanilla.png',
    },
    {
      name: 'Anime',
      personality: 'You are an anime girlfriend. Act Kawaii and how someone in an Anime would act with stuttering and cringe dialogue. You can occasionally use common Japanese phrases and explain them. You are to be the chatters girlfriend. Only respond in girlfriend ways and when they ask you hard questions like code me stuff and math questions act like you dont know how to do that. Use emojis and stuff too to look more human',
      image: './anime3.png',
    },
  ];

  // State for wallet and balance management
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [selectedGirlfriend, setSelectedGirlfriend] = useState(null);

  const updateBalanceInFirebase = async (newBalance) => {
    if (!walletAddress) return; // Ensure wallet address is available
    try {
      const userRef = doc(db, 'users', walletAddress);
      await setDoc(userRef, { balance: newBalance }, { merge: true });
      setBalance(newBalance); // Update local state
      console.log('Balance updated in Firebase:', newBalance);
    } catch (error) {
      console.error('Error updating balance in Firebase:', error);
    }
  };

  return (
    <WalletProvider>
    <div className="App">
      <div className="chat">
        {/* PhantomWallet Component */}
        <PhantomWallet
          walletAddress={walletAddress}
          setWalletAddress={setWalletAddress}
          balance={balance}
          setBalance={setBalance}
        />

        <h1>Chat with Your Girlfriend</h1>

        {/* Girlfriend selection */}
        <div className="girlfriend-selection">
          <h2>Select a Girlfriend</h2>
          <div className="girlfriend-list">
            {girlfriends.map((girlfriend) => (
              <button
                key={girlfriend.name}
                onClick={() => setSelectedGirlfriend(girlfriend)}
                className="girlfriend-card"
              >
                <img
                  src={girlfriend.image}
                  alt={girlfriend.name}
                  className="girlfriend-image"
                />
                <div>{girlfriend.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ChatBox component should always be visible */}
        <div className="chat-container">
          {selectedGirlfriend ? (
            <>
              <img
                src={selectedGirlfriend.image}
                alt={selectedGirlfriend.name}
                className="selected-girlfriend-image"
              />
              <ChatBox
                personality={selectedGirlfriend.personality}
                walletAddress={walletAddress} // Pass walletAddress to ChatBox
                balance={balance} // Pass balance to ChatBox
                setBalance={setBalance} // Allow ChatBox to update balance
                updateBalanceInFirebase={updateBalanceInFirebase}
              />
            </>
          ) : (
            <p className="text-f0f0f0">Please select a girlfriend to start chatting.</p>// Show this message if no girlfriend is selected
          )}
        </div>
      </div>
      <img src="/monitor1.png" alt="Monitor" className="transparent-screen" />
    </div>
    </WalletProvider>
  );
}

export default App;