import React, { useState } from 'react';
import axios from 'axios';
import AWS from 'aws-sdk';
import './EditGroupModal.css';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const s3 = new AWS.S3({
    accessKeyId: process.env["REACT_APP_AWS_ACCESS_KEY_ID"],
    secretAccessKey: process.env["REACT_APP_AWS_SECRET_ACCESS_KEY"],
    region: process.env["REACT_APP_AWS_REGION"],
});

const uploadToS3 = async (file) => {
    const params = {
        Bucket: process.env["REACT_APP_S3_BUCKET_NAME"],
        Key: `${Date.now()}-${file.name}`, 
        Body: file,
    };
    try {
        const data = await s3.upload(params).promise();
        return data.Location; 
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error('Upload failed');
    }
};

function EditGroupModal({ chat, onClose, onGroupUpdated, onSelectedChat }) {
  const [groupName, setGroupName] = useState(chat.m_group_name);
  const [groupAvatar, setGroupAvatar] = useState(null);

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setGroupAvatar(e.target.files[0]);
    }
  };

  const handleUpdateGroup = async () => {
    try {
      let avatarUrl = chat.m_group_avatar;
      if (groupAvatar) {
        const uploadResult = await uploadToS3(groupAvatar);
        avatarUrl = uploadResult;
      }

      const response = await axios.put(`${process.env.REACT_APP_BASE_API}/api/group/updateGroupInfor/`, {
        m_group_id: chat._id,
        m_group_name: groupName,
        m_group_avatar: avatarUrl,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.status === 200) {
        toast.success('Group updated successfully!');
        // showNotification('Group updated successfully!', 'success');
        // chat.m_group_name = groupName;
        // chat.m_group_avatar = avatarUrl;
        onGroupUpdated();
        onClose();
        // onSelectedChat(chat);
        await sleep(1000);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating group:', error);
    //   showNotification('Failed to update group.', 'error');
      toast.error('Failed to update group.');
    }
  };

  return (
    <div className="edit-group-modal">
      <div className="edit-group-modal-content">
        <h2>Edit Group</h2>
        <div>
            <label>Group Name</label>
            <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            />
        </div>
        <div>
            <label>Group Avatar</label>
            <input
            type="file"
            onChange={handleAvatarChange}
            />
        </div>
        <button onClick={handleUpdateGroup}>Update</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>      
  );
}

export default EditGroupModal;