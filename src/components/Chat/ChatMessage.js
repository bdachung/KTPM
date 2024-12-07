import React from 'react';
import './ChatMessage.css';

function ChatMessage({ message, currentUser }) {
  const username = message.source;
  console.log("ChatMessage", message);
  const message_text = message.content.text;
  // const m_message_image_url = message.m_message_image;
  const message_image_url = null;
  // const { user_id, timestamp, content, imageUrl } = message;
  const isMine = username === currentUser;

  // console.log(username, currentUser);

  return (
    <div className={`chat-message ${isMine ? 'mine' : 'theirs'}`}>
      {!isMine && <div className="message-sender">{username}</div>}
      <div className="message-content">
        <div className="message-text">{message_text}</div>
        {message_image_url && <img src={message_image_url} alt="Sent image" className="message-image" />}
      </div>
    </div>
  );
}

export default ChatMessage;