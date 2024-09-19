import axios from 'axios';

const BACKEND_URL = 'http://localhost:4000/api/chat'; // Point to local server

export const getAIResponse = async (userMessage) => {
  try {
    const response = await axios.post(BACKEND_URL, { message: userMessage });
    return response.data.response;
  } catch (error) {
    console.error('Error getting AI response:', error);
    return "Sorry, I couldn't respond. Try again later!";
  }
};
