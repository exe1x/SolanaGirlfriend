import React from 'react';

const Message = ({ message }) => {
  const { text, sender } = message;
  return (
    <div className={`message ${sender}`}>
      {text}
    </div>
  );
};

export default Message;
