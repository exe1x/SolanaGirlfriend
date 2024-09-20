import axios from 'axios';

const BACKEND_URL = 'https://frozen-wave-57486-08ae7d2b8b49.herokuapp.com/api/chat'; // Backend server URL

export const getAIResponse = async (userMessage, personality) => {
  try {
    // Send both the user message and the personality to the Express server
    const response = await axios.post(BACKEND_URL, {
      message: userMessage,
      personality: personality,  // Include the personality in the request
    });
    return response.data.response;
  } catch (error) {
    console.error('Error getting AI response:', error);
    return "Sorry, I couldn't respond. Try again later!";
  }
};

