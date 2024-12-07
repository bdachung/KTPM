import React from 'react';
import { Button, Avatar } from "@mui/material";
import './profile.css';

const Modal = ({ isOpen, onClose, children, user }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="profileModal profile-cover-image">
        <button onClick={onClose} className="close-button">
          &times;
        </button>
        <img
          src={require("../../assets/backgroundProfile.jpg")}
          alt="Cover"
        />
      </div>
      <div className="modal-container">
        <div className="modal-header">
          <div className="profile-avatar-container">
            <Avatar
              className="profile-avatar"
              alt={user.username}
              src={user.avatar_link || "../../assets/basic_avatar.jpg"}
            />
          </div>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
