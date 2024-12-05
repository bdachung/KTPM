import React from 'react';
import './ChatMessage.css';

function ChatMessage({ message, currentUser }) {
  const { user_id, timestamp, content, imageUrl } = message;
  const isMine = user_id === currentUser;

  return (
    <div className={`chat-message ${isMine ? 'mine' : 'theirs'}`}>
      {!isMine && <div className="message-sender">{user_id}</div>}
      <div className="message-content">
        <div className="message-text">{content}</div>
        {imageUrl && <img src={imageUrl} alt="Sent image" className="message-image" />}
      </div>
    </div>
  );
}

export default ChatMessage;