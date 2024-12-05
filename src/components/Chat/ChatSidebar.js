import React from 'react';

function ChatSidebar({ chats, onSelectChat }) {
  return (
    <div className="chat-sidebar">
      {chats.map(chat => (
        <div key={chat.id} className="chat-item" onClick={() => onSelectChat(chat)}>
          <div className="chat-info">
            <h3>Conversation {chat.id}</h3>
            <p>Participants: {chat.participants.join(', ')}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatSidebar;