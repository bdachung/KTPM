import React, { forwardRef, useState } from "react";
import { Avatar, Button } from "@mui/material";
import ViewProfileModal from "./ViewProfileModal";
import EditProfileModal from "./EditProfileModal";
import CoverImageModal from "./CoverImageModal";
import AvatarModal from "./AvatarModal";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import "./ProfileHeaderSection.css";
import AWS from "aws-sdk";

const ProfileHeaderSection = forwardRef(
  (
    {
      user,
      isViewModalOpen,
      isEditModalOpen,
      openViewModal,
      closeViewModal,
      openEditModal,
      closeEditModal,
      handleSubmit,
      handleChange,
      formData,
    },
    ref
  ) => {
    const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
    const { accessToken } = useAuth();
    const [coverImage, setCoverImage] = useState(
      user.cover_link || require("../../assets/backgroundProfile.jpg")
    );
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [avatarImage, setAvatarImage] = useState(
      user.avatar_link || "../../assets/basic_avatar.jpg"
    );

    const handleCoverUpdate = async (file) => {
      try {
        const s3 = new AWS.S3({
          accessKeyId: process.env["REACT_APP_AWS_ACCESS_KEY_ID"],
          secretAccessKey: process.env["REACT_APP_AWS_SECRET_ACCESS_KEY"],
          region: "ap-southeast-1",
        });

        const params = {
          Bucket: "ivsenglishapp",
          Key: `${Date.now()}-${file.name}`,
          Body: file,
        };

        const uploadResult = await s3.upload(params).promise();
        const coverLink = uploadResult.Location;

        await axios.put(
          `${process.env["REACT_APP_BASE_API"]}/api/teacher/update-cover-image/`,
          {
            m_cover_link: coverLink,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setCoverImage(coverLink);
      } catch (error) {
        console.error("Error updating cover image:", error);
        alert("Failed to update cover image");
      }
    };

    const handleAvatarUpdate = async (file) => {
      try {
        const s3 = new AWS.S3({
          accessKeyId: process.env["REACT_APP_AWS_ACCESS_KEY_ID"],
          secretAccessKey: process.env["REACT_APP_AWS_SECRET_ACCESS_KEY"],
          region: "ap-southeast-1",
        });

        const params = {
          Bucket: "ivsenglishapp",
          Key: `${Date.now()}-${file.name}`,
          Body: file,
        };

        const uploadResult = await s3.upload(params).promise();
        const avatarLink = uploadResult.Location;

        await axios.put(
          `${process.env["REACT_APP_BASE_API"]}/api/teacher/updateTeacherInfor/`,
          {
            m_avatar_link: avatarLink,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setAvatarImage(avatarLink);
      } catch (error) {
        console.error("Error updating avatar image:", error);
        alert("Failed to update avatar image");
      }
    };

    return (
      <div className="profile-header-container">
        <div className="profile-cover-container">
          <div className="profile-cover-image">
            <img src={coverImage} alt="Cover" />
            <button
              className="edit-cover-button"
              onClick={() => setIsCoverModalOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Cover Photo
            </button>
          </div>
        </div>

        <div className="profile-info">
          <div className="profile-info-text" ref={ref}>
            <div className="profile-avatar-container">
              <Avatar
                className="profile-avatar"
                alt={user.username}
                src={avatarImage}
                onClick={() => setIsAvatarModalOpen(true)}
              />
              <button
                className="edit-avatar-button"
                onClick={() => setIsAvatarModalOpen(true)}
              >
                ✎
              </button>
            </div>

            <h1 className="fullname">{user.fullName}</h1>
            <p className="bio">{user.bio || ""}</p>

            <div className="button-field">
              <Button
                variant="contained"
                color="primary"
                className="profile-button"
                onClick={openViewModal}
              >
                Profile
              </Button>
              <Button
                variant="contained"
                color="primary"
                className="edit-button"
                onClick={openEditModal}
              >
                <img
                  src={require("../../assets/edit-button.png")}
                  alt="Edit"
                  className="edit-icon"
                />
              </Button>
            </div>
          </div>
        </div>

        <ViewProfileModal
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          user={user}
        />

        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          user={user}
          formData={formData}
          onSubmit={handleSubmit}
          onChange={handleChange}
        />

        <CoverImageModal
          open={isCoverModalOpen}
          onClose={() => setIsCoverModalOpen(false)}
          onUpdate={handleCoverUpdate}
        />

        <AvatarModal
          open={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
          onUpdate={handleAvatarUpdate}
        />
      </div>
    );
  }
);

export default ProfileHeaderSection;
