import React from "react";

const GeneralInformation = ({ user }) => {
  const infoItems = [
    // { label: "ID User", value: user.m_id },
    { label: "Username", value: user.username },
    { label: "Email", value: user.email },
    { label: "Fullname", value: user.fullName },
    { label: "Birthday", value: user.dob },
    { label: "nickName", value: user.nickName },
    // { label: "BIO", value: user.bio }
  ]

  return (
    <div className="profile-content">
      <h2>General information</h2>
      {/* <div className="profile-bio" style={{paddingTop: "10px", paddingBottom: "20px", fontSize: 25}}>BIO: {user.bio}</div> */}
      <div className="profile-info-grid">
        {infoItems.map((item, index) => (
          <div key={index} className="info-item">
            <span className="info-label">{item.label}</span>
            <span className="info-value">
              {item.isStatus ? (
                <span className={`status-button ${item.statusClass}`}>
                  <span className="status-dot"></span>
                  {item.value}
                </span>
              ) : (
                item.value || "---"
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneralInformation;
