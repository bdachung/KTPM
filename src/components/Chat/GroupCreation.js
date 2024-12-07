import React, { useState } from 'react';
import axios from 'axios';
import './GroupCreation.css';
import { useAuth } from '../../AuthContext';
import { toast } from 'react-toastify';

const BASE_URL = "http://54.167.91.115";

function GroupCreation({ onClose, onGroupCreated, currentUser }) {
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const [groupName, setGroupName] = useState('');
  const [groupAvatar, setGroupAvatar] = useState(null);
  const [usernameToAdd, setUsernameToAdd] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { accessToken } = useAuth();

  const getFileExtension = (fileName) => {
    return fileName.split('.').pop();
  };

  const generatePresignedUrl = async (file) => {
    const fileExtension = getFileExtension(file.name);
    const response = await axios.get(`${BASE_URL}:4001/upload/presigned_url`, {
      params: { ext: fileExtension, category: 'group' },
      headers: {
        'accesskey': accessToken,
        'user': currentUser,
      },
    });
    return response.data;
  };

  const uploadToS3 = async (file) => {
    const presignedUrl = await generatePresignedUrl(file);
    console.log(presignedUrl);
    await axios.put(presignedUrl.url, file, {
      headers: {
        'Content-Type': file.type,
        accesskey: accessToken,
        user: currentUser,
      },
    });
    return presignedUrl.url;
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setGroupAvatar(e.target.files[0]);
    }
  };

  const handleAddMember = () => {
    if (usernameToAdd.trim() && !selectedMembers.some(member => member.username === usernameToAdd.trim())) {
      setSelectedMembers([...selectedMembers, { username: usernameToAdd.trim() }]);
      setUsernameToAdd('');
    }
  };

  const handleRemoveMember = (username) => {
    setSelectedMembers(selectedMembers.filter(member => member.username !== username));
  };

  const handleCreateGroup = async () => {
    console.log('Creating group...');
    if (selectedMembers.length < 2) {
        toast.error('Group must have at least 3 participants.');
        return;
    }
    try {
      let avatarUrl = null;
      // console.log(BASE_URL);
      if (groupAvatar) {
        const formData = new FormData();
        formData.append('file', groupAvatar);
        const uploadResult = await uploadToS3(groupAvatar);
        avatarUrl = uploadResult;
      }
      console.log(BASE_URL);
      const response = await axios.post(`${BASE_URL}:4002/`, {
        name: groupName,
        profilePic: avatarUrl,
        members: selectedMembers.map(member => member.username),
      }, {
        headers: {
          accesskey: accessToken,
          user: currentUser,
        },
      });

      if (response.status === 200) {
        toast.success('Group created successfully!');
        await sleep(1000); // 1 second delay
        onGroupCreated();
        onClose();
        window.location.reload();
      }
    } catch (error) {
      toast.error('Failed to create group.');
      console.error('Error creating group:', error);
    }
  };

  return (
    <div className="group-creation-modal">
      <div className="group-creation-modal-content">
        <h2>Create Group</h2>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <input
          type="file"
          onChange={handleAvatarChange}
        />
        <div className="add-member">
          <input
            type="text"
            placeholder="Enter username..."
            value={usernameToAdd}
            onChange={(e) => setUsernameToAdd(e.target.value)}
          />
          <button onClick={handleAddMember}>Add</button>
        </div>
        <div className="selected-members">
          {selectedMembers.map(member => (
            <div key={member.username} className="selected-member-item">
              <span>{member.username}</span>
              <button onClick={() => handleRemoveMember(member.username)}>X</button>
            </div>
          ))}
        </div>
        <button onClick={handleCreateGroup}>Create</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default GroupCreation;