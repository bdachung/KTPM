import React from "react";
import Modal from "./viewProfile";

const ViewProfileModal = ({ isOpen, onClose, user }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} user={user}>
      <h2 className="fullname" style={{ marginTop: 20 }}>
        {user.fullName}
      </h2>
      <p className="bio">{user.bio || ""}</p>
      <div
        className="profile-info-grid"
        style={{ textAlign: "left", padding: "0 40px" }}
      >
        <div className="info-item">
          <span className="info-label">Fullname</span>
          <span className="info-value">{user.fullName || "---"}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Address</span>
          <span className="info-value">{user.address || "---"}</span>
        </div>
      </div>
    </Modal>
  );
};

export default ViewProfileModal;
