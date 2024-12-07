import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import ProfileHeader from "../../components/ProfileHeader/profileHeader";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import GeneralInformation from "../../components/Profile/GeneralInformation";
import ProfileHeaderSection from "../../components/Profile/ProfileHeaderSection";

const BASE_URL = "http://54.167.91.115";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username, setUsername, accessToken, refreshToken, setAccessToken, setRefreshToken } =
    useAuth();
  const navigate = useNavigate();
  const [zoomedImage, setZoomedImage] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("Reject");
  const [pendingImages, setPendingImages] = useState({});
  const [hasImageChanges, setHasImageChanges] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const openViewModal = () => setIsViewModalOpen(true);
  const closeViewModal = () => setIsViewModalOpen(false);
  const openEditModal = () => {
    setFormData({
        username: user.username || "",
        fullName: user.fullName || "",
        address: user.address || "",
        email: user.email || "",
        bio: user.bio || "",
        nickName: user.nickName || "",
        dob: user.dob || "",
    });
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  const [formData, setFormData] = useState({
    bio: "",
    fullName: "",
    nickName: "",
    address: "",
    dob: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${BASE_URL}:4000/`,
        {
            profile:{
                username: formData.username || user.username,
                fullName: formData.fullName || user.fullName,
                address: formData.address || user.address,
                email: formData.email || user.email,
                bio: formData.bio || user.bio,
                nickName: formData.nickName || user.nickName,
                dob: formData.dob || user.dob,
            }
        },
        {
          headers: {
            accesskey: accessToken,
            user: username,
          },
        }
      );

      const response = await axios.get(
        `${BASE_URL}:4000/`,
        {
          headers: {
            accesskey: accessToken,
            user: username,
          },
        }
      );
      setUser(response.data);
      closeEditModal();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const toggleZoom = (imageSrc) => {
    setZoomedImage(zoomedImage ? null : imageSrc);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env["REACT_APP_BASE_API"]}/api/logout/`, {
        refresh: refreshToken,
      });
      setAccessToken(null);
      setRefreshToken(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

//   const handleImagesUpdate = useCallback((section, newFiles, hasChanges) => {
//     if (hasChanges) {
//       setPendingImages((prev) => {
//         const existingFiles = prev[section] || [];
//         const totalFiles = existingFiles.length + newFiles.length;
//         if (totalFiles > 10) {
//           alert(
//             `Tổng số lượng ảnh trong section ${section} không được vượt quá 10 tấm.`
//           );
//           return prev;
//         }

//         return {
//           ...prev,
//           [section]: newFiles,
//         };
//       });
//       setHasImageChanges(true);
//     } else if (section === null && newFiles === null) {
//       setPendingImages({});
//       setHasImageChanges(false);
//     }
//   }, []);

//   const handleStatusUpdate = async () => {
//     try {
//       setLoading(true);
//       const uploadedUrls = {};
//       for (const section of Object.keys(pendingImages)) {
//         // Chỉ lặp qua các section có thay đổi
//         const images = pendingImages[section];
//         const sectionUrls = [];

//         for (const image of images) {
//           if (typeof image === "string") {
//             sectionUrls.push(image);
//           } else if (image instanceof File) {
//             try {
//               const url = await uploadToS3(image);
//               sectionUrls.push(url);
//             } catch (error) {
//               console.error("Error uploading file:", error);
//               throw error;
//             }
//           }
//         }

//         uploadedUrls[`m_${section}_image`] = sectionUrls.join(",");
//       }

//       await axios.put(
//         `${process.env["REACT_APP_BASE_API"]}/api/teacher/updateTeacherInfor/`,
//         {
//           ...uploadedUrls,
//           m_status: "IN_ACTIVE",
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );

//       setPendingImages({});
//       setHasImageChanges(false);

//       window.location.reload();
//     } catch (error) {
//       console.error("Update failed:", error);
//       alert("Failed to update images. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

  useEffect(() => {
    if (!accessToken) {
      navigate("/");
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}:4000/`,
          {
            headers: {
                accesskey: accessToken,
                user: username,
            },
          }
        );
        const response_data = response.data;
        setUser(response_data);
        setFormData({
            username: response_data.username || "",
            fullName: response_data.fullName || "",
            address: response_data.address || "",
            email: response_data.email || "",
            bio: response_data.bio || "",
            nickName: response_data.nickName || "",
            dob: response_data.dob || "",
        });

      } catch (error) {
        setError("Lỗi khi tải thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchUserProfile();
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        fullName: user.fullName || "",
        address: user.address || "",
        email: user.email || "",
        bio: user.bio || "",
        nickName: user.nickName || "",
        dob: user.dob || "",
      });
    }
  }, [user]);

  if (error) return <div>{error}</div>;
  if (!user) return <div>Không tìm thấy thông tin người dùng.</div>;

  return (
    <div className="profile-page">
      <ProfileHeader username={user.fullName} />
      <ProfileHeaderSection
        user={user}
        isViewModalOpen={isViewModalOpen}
        isEditModalOpen={isEditModalOpen}
        openViewModal={openViewModal}
        closeViewModal={closeViewModal}
        openEditModal={openEditModal}
        closeEditModal={closeEditModal}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formData={formData}
      />
      <GeneralInformation user={user} />
      {/* <DegreeInformation
        user={user}
        toggleZoom={toggleZoom}
        onImagesUpdate={handleImagesUpdate}
      /> */}
      {/* {hasImageChanges && (
        <>
          <button
            className="status-change-button"
            onClick={() => setIsUpdateModalOpen(true)}
          >
            Update Status
          </button>
          <UpdateStatusModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            onConfirm={() => {
              handleStatusUpdate();
              setIsUpdateModalOpen(false);
            }}
          />
        </>
      )}
      {zoomedImage && (
        <div className="modal-overlay" onClick={() => setZoomedImage(null)}>
          <img src={zoomedImage} alt="Zoomed" className="image-modal" />
        </div>
      )} */}
    </div>
  );
};

export default Profile;
