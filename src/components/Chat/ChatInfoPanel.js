import React, { useState } from 'react';
import './ChatInfoPanel.css';
import EditGroupModal from './EditGroupModal';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ChatInfoPanel({ chat, onGroupUpdated, onSelectedChat }) {
  const [showParticipants, setShowParticipants] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  if (!chat) {
    return <div className="chat-info-panel">Select a chat to see details</div>;
  }

  const handleShowParticipants = () => {
    setShowParticipants(!showParticipants);
  };

  const handleAddMembers = () => {
    // Implement the logic to add members
    console.log('Add Members');
  };

  const handleKickMembers = () => {
    // Implement the logic to kick members
    console.log('Kick Members');
  };

  const handleLeaveGroup = () => {
    // Implement the logic to leave the group
    console.log('Leave Group');
  };

  const handleEditGroup = () => {
    setShowEditModal(true);
  };

  return (
    <div className="chat-info-panel">
      <div className="chat-info-header">
        <div className="chat-info-avatar">
          <img src={chat.profilePic} alt={`${chat.name} avatar`} />
        </div>
        <h2 className="chat-info-name">{chat.name}</h2>
        <button className="edit-group-button" onClick={handleEditGroup}>Edit Group</button>
      </div>
      <div className="chat-info-actions">
        <button onClick={handleShowParticipants}>Show Participants</button>
        {showParticipants && (
          <div className="participants-list">
            <ul>
              {chat.members.map(participant => (
                <li key={participant.username} className={`participant-item ${participant.role === "admin" ? 'admin' : ''}`}>
                  <span className="participant-username">{participant.username}</span>
                  <span className="participant-role">{participant.role}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={handleAddMembers}>Add Members</button>
        <button onClick={handleKickMembers}>Kick Members</button>
        <button onClick={handleLeaveGroup}>Leave Group</button>
      </div>
      {showEditModal && (
        <EditGroupModal
          chat={chat}
          onClose={() => setShowEditModal(false)}
          onGroupUpdated={onGroupUpdated}
          onSelectedChat={onSelectedChat}
        />
      )}
    </div>
  );
}

export default ChatInfoPanel;