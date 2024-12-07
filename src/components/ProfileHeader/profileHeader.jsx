import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./profileHeader.css";
import logo from "../../assets/splash.png";
import { Avatar, Menu, MenuItem, IconButton } from "@mui/material";
// import ChangePasswordModal from "../Modal/ChangePassWord/ChangePasswordModal";
// import NotificationModal from "../Modal/NotificationModal";
import axios from "axios";
import { useAuth } from "../../AuthContext";

const BASE_URL = "http://54.167.91.115";

const ProfileHeader = () => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
//   const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
//   const [notificationMessage, setNotificationMessage] = useState("");
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation();
  const { username, setUsername, accessToken, refreshToken, setAccessToken, setRefreshToken } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      navigate("/");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}:4000/auth`,
          {
            headers: {
              accesskey: accessToken,
              user: username
            },
          }
        );

        if (response.status === 401) {
          navigate("/");
        }

        const userProfile = response.data;

        setUser(userProfile);

      } catch (error) {
        navigate("/");
      }
    };

    fetchUserProfile();
  }, [accessToken, navigate]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleClose();
    navigate("/profile");
  };

  const handleLogoClick = () => {
    navigate("/chat");
  };

  const handleCourseClick = () => {
    navigate("/teacher/course");
  };

  const handleChatClick = () => {
    navigate("/chat");
  };

  const navigateToChatBox = () => {
    navigate("/chatbox");
  };

  const handleCloseChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
  };

//   const handleCloseNotificationModal = () => {
//     setIsNotificationModalOpen(false);
//     setNotificationMessage("");
//   };

  const handleChangePassword = (currentPassword, newPassword) => {
    // setNotificationMessage("");

    axios
      .post(
        `${process.env["REACT_APP_BASE_API"]}/api/reset-password/`,
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        // setNotificationMessage("Password changed successfully");
        // setIsNotificationModalOpen(true);
        // setIsChangePasswordModalOpen(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
        //   setNotificationMessage("Mật khẩu hiện tại không chính xác.");
        } else {
        //   setNotificationMessage(
        //     "An error occurred while changing the password."
        //   );
        }
        // setIsNotificationModalOpen(true);
      });
  };

  const handleLogout = async () => {
    try {
    //   await axios.post(`${process.env["REACT_APP_BASE_API"]}/api/logout/`, {
    //     refresh: refreshToken,
    //   });
      setAccessToken(null);
      setRefreshToken(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleUserClick = () => {
    navigate("/teacher/search-users");
  };

  return (
    <header className="profile-header">
      <div
        className="logo-section"
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
      >
        <img src={logo} alt="logo" width={32} height={32} className="logo" />
        <h1 className="title">Chat App</h1>
      </div>

      <nav className="nav">
        <div
          className={`nav-item ${
            location.pathname.startsWith("/chat") ? "selected" : ""
          }`}
          onClick={handleChatClick}
        >
          <span>Messages</span>
        </div>

        <div
          className={`nav-item ${
            location.pathname.startsWith("/user")
              ? "selected"
              : ""
          }`}
          onClick={handleUserClick}
        >
          <span>User</span>
        </div>
      </nav>

      <div className="user-section">
        <button className="notice-button">
          <img
            src={require("../../assets/chat-icon.jpg")}
            alt="Chat"
            className="chat-icon"
          />
          <span className="notification-badge">1</span>
        </button>

        <IconButton onClick={handleClick}>
          <Avatar
            className="user-avatar"
            alt="User"
            src={user ? user.avatar_link : "/path/to/default-avatar.jpg"}
          />
        </IconButton>

        <span className="user-name">{username}</span>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          className="menu"
        >
          <MenuItem
            onClick={handleProfileClick}
            className="menu-item menu-item-profile"
          >
            Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              setIsChangePasswordModalOpen(true);
              handleClose();
            }}
            className="menu-item menu-item-profile"
          >
            Reset Password
          </MenuItem>
          <MenuItem
            onClick={handleClose}
            className="menu-item menu-item-profile"
          >
            Language
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            className="menu-item menu-item-profile"
          >
            Logout
          </MenuItem>
        </Menu>

        {/* {isChangePasswordModalOpen && (
          <ChangePasswordModal
            onClose={handleCloseChangePasswordModal}
            onChangePassword={handleChangePassword}
          />
        )} */}
      </div>

      {/* {isNotificationModalOpen && (
        <NotificationModal
          message={notificationMessage}
          onClose={handleCloseNotificationModal}
        />
      )} */}
    </header>
  );
};

export default ProfileHeader;
