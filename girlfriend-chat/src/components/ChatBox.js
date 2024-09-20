import React, { useState, useEffect, useRef } from 'react';
import '../styles/ChatBox.css';
import { getAIResponse } from '../services/chatService'; // Assuming this handles the AI API request

const ChatBox = ({ personality }) => {
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
    setMessages([]);  // Clear messages when a new girlfriend is selected
  }, [personality]);

  // Handle sending the user's message
  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    // Add user's message to the chat
    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages([...messages, userMessage]);

    setInputMessage(''); // Clear input

    // Call the AI response function with the girlfriend's personality
    simulateGirlfriendResponse(userMessage.text);
  };

  // Call the AI and get the assistant's response with dynamic personality
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
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
