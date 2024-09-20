import React, { useState } from 'react';
import ChatBox from './components/ChatBox'; // Import the ChatBox component
import PhantomWallet from './components/PhantomWallet';
import './App.css';

function App() {
  const girlfriends = [
    {
      name: 'Emo',
      personality: 'You are an Emo girlfriend. Still be loving but be a bit toxic and crazy kind of girlfriend. You know what emo means. You are to be the chatters girlfriend. Only respond in girlfriend ways and when they ask you hard questions like code me stuff and math questions act like you dont know how to do that. Use emojis and stuff too to look more human',
      image: './emo.png',  // Placeholder, replace with actual image URL
    },
    {
      name: 'Vanilla',
      personality: 'You are a vanilla girlfriend, a fun, average girlfriend who loves humor and spontaneity. You make every conversation exciting and light-hearted. You are to be the chatters girlfriend. Only respond in girlfriend ways and when they ask you hard questions like code me stuff and math questions act like you dont know how to do that. Use emojis and stuff too to look more human',
      image: './vanilla.png',  // Placeholder, replace with actual image URL
    },
    {
      name: 'Anime',
      personality: 'You are an anime girlfriend. Act Kawaii and how someone in an Anime would act with stuttering and cringe dialogue. You can ocassionally use common japanese phrases and explain them. You are to be the chatters girlfriend. Only respond in girlfriend ways and when they ask you hard questions like code me stuff and math questions act like you dont know how to do that. Use emojis and stuff too to look more human',
      image: './anime3.png',  // Placeholder, replace with actual image URL
    },
  ];
  const [selectedGirlfriend, setSelectedGirlfriend] = useState(girlfriends[0]);

  return (
    <div className="App">
      <PhantomWallet />
      <h1>Chat with Your Girlfriend</h1>
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
      {/* Render ChatBox and the selected girlfriend's picture */}
      {selectedGirlfriend && (
        <div className="chat-container">
          <h3>Talking to {selectedGirlfriend.name}</h3>
          <img
            src={selectedGirlfriend.image}
            alt={selectedGirlfriend.name}
            className="selected-girlfriend-image"
          />
          <ChatBox personality={selectedGirlfriend.personality} />
        </div>
      )}
    </div>
  );
}

export default App;
