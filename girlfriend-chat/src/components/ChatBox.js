import React, { useState, useEffect, useRef } from 'react';
import '../styles/ChatBox.css';
import { getAIResponse } from '../services/chatService';

const ChatBox = ({ personality, walletAddress, balance, setBalance, updateBalanceInFirebase }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the chat after each new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clear the chat messages when the personality changes
  useEffect(() => {
    setMessages([]);  // Clear messages when a new personality is selected
  }, [personality]);

  // Handle sending the user's message
  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || balance <= 0) return;

    // Deduct 1 token from balance
    const newBalance = balance - 1;
    setBalance(newBalance);
    updateBalanceInFirebase(newBalance);

    // Add user's message to the chat
    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages([...messages, userMessage]);

    setInputMessage(''); // Clear input

    // Call the AI response function with the girlfriend's personality
    simulateGirlfriendResponse(userMessage.text);
  };

  const simulateGirlfriendResponse = async (userMessage) => {
    try {
      const gfResponse = await getAIResponse(userMessage, personality);

      // Add the AI's response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: gfResponse, sender: 'gf' }
      ]);
    } catch (error) {
      console.error('Error getting AI response:', error);
    }
  };

  return (
    <div className="chatbox">
      <div className="balance-container">
        <p>Balance: {balance} Credits</p>
      </div>
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage} disabled={balance <= 0}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;