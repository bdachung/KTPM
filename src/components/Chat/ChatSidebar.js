import React, { useState } from 'react';
import './ChatSidebar.css';
import GroupCreation from './GroupCreation';

function ChatSidebar({ chats, onSelectedChat, username }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  const handleChatClick = (chat) => {
    onSelectedChat(chat);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGroupCreated = () => {
    // Optionally, you can fetch the updated chat list here

  };
  // console.log(chats);
  const filteredChats = (chats || [])
  .filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  // .sort((a, b) => new Date(b.m_group_lastUpdated) - new Date(a.m_group_lastUpdated));

  return (
    <div className="chat-sidebar">
      <div className="chat-sidebar-header">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="chat-sidebar-search"
        />
        <button className="chat-sidebar-create-group" onClick={() => setShowCreateGroupModal(true)}>Create Group</button>
      </div>
      <div className="chat-sidebar-list">
        {filteredChats.map((chat) => {
          // const isGroupChat = chat.m_group_type === "group";
          // const chatName = isGroupChat
          //   ? chat.m_group_name
          //   : chat.m_group_participants.find((participant) => participant.username !== username).username;
          // const lastMessage = chat.m_group_lastMessage;
          // let lastMessageSender = chat.m_group_lastSender.username ? chat.m_group_lastSender.username : '';

          // lastMessageSender = lastMessageSender === username ? 'You' : lastMessageSender;

          // console.log(lastMessageSender);

          return (
            <div key={chat.groupId} className="chat-sidebar-item" onClick={() => handleChatClick(chat)}>
              <img src={chat.profilePic || 'default-group-image.png'} alt="Group" className="chat-sidebar-item-image" />
              <div className="chat-sidebar-item-content">
                <div className="chat-sidebar-item-name">{chat.name}</div>
                {/* <div className="chat-sidebar-item-last-message">
                  {lastMessageSender}: {lastMessage}
                </div> */}
              </div>
            </div>
          );
        })}
      </div>
    {showCreateGroupModal && (
      <GroupCreation
        onClose={() => setShowCreateGroupModal(false)}
        onGroupCreated={handleGroupCreated}
        currentUser={username}
      />
    )}
    </div>
  );
}

export default ChatSidebar;