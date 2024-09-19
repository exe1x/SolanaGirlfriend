import React, { useState, useEffect, useRef } from 'react';
import '../styles/ChatBox.css';
import Message from './Message'; // Optional: separate message component for better structure
import { getAIResponse } from '../services/chatService'; // Import the service to fetch AI responses

const ChatBox = () => {
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

  // Handle sending the user's message
  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    // Add user's message to the chat
    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages([...messages, userMessage]);

    setInputMessage(''); // Clear the input

    // Call the AI response function
    simulateGirlfriendResponse(inputMessage);
  };

  // Call the AI and get the assistant's response
  const simulateGirlfriendResponse = async (userMessage) => {
    try {
      const gfResponse = await getAIResponse(userMessage);

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
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
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
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
