import Modal from "./viewProfile";

const EditProfileModal = ({ isOpen, onClose, user, onSubmit, onChange, formData }) => {
  const formFields = [
    {
      label: "Username",
      type: "text",
      name: "username",
      value: user?.username || "",
      disabled: true
    },
    {
      label: "Bio - Description",
      type: "textarea",
      name: "bio",
      value: formData?.bio || "",
      placeholder: "mô tả"
    },
    {
      label: "Gmail",
      type: "email",
      name: "email",
      value: user?.email || "",
      disabled: true
    },
    {
      label: "Fullname",
      type: "text",
      name: "fullName", 
      value: formData?.fullName || "",
    },
    // {
    //   label: "Số điện thoại",
    //   type: "text",
    //   name: "m_phone",
    //   value: formData?.m_phone || "",
    // },
    {
      label: "Address",
      type: "text",
      name: "address",
      value: formData?.address || "",
    },
    {
      label: "NickName",
      type: "text",
      name: "nickName",
      value: formData?.nickName || "",
    },
    {
      label: "Birthday",
      type: "date",
      name: "dob",
      value: formData?.dob || "",
    },
  ];

  const renderFormField = (field) => {
    return (
      <div className="form-group" key={field.name}>
        <label>{field.label}</label>
        {field.type === "textarea" ? (
          <textarea
            name={field.name}
            value={field.value}
            disabled={field.disabled}
            onChange={onChange}
            placeholder={field.placeholder}
          />
        ) : (
          <input
            type={field.type}
            name={field.name}
            value={field.value}
            disabled={field.disabled}
            onChange={onChange}
            placeholder={field.placeholder}
          />
        )}
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} user={user}>
      <form className="profile-form" onSubmit={onSubmit}>
        {formFields.map(renderFormField)}
        
        <div style={{
          marginTop: 20,
          justifyContent: "end",
          display: "flex",
          gap: 10
        }}>
          <button type="button" className="cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit">
            Update
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
