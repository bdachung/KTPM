import React from 'react';

function ChatInfoPanel({ chat }) {
  if (!chat) {
    return <div className="chat-info-panel">Select a chat to see details</div>;
  }

  return (
    <div className="chat-info-panel">
      <h2>{chat.name}</h2>
      <img src={chat.avatar} alt={`${chat.name} avatar`} />
      {/* Add more chat details here */}
    </div>
  );
}

export default ChatInfoPanel;