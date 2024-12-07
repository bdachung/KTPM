import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useDropzone } from 'react-dropzone';

const CoverImageModal = ({ open, onClose, onUpdate }) => {
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false,
    onDrop: (acceptedFile) => {
      setCoverImage(acceptedFile[0]);
      setPreview(URL.createObjectURL(acceptedFile[0]));
    }
  });

  const handleSave = () => {
    if (coverImage) {
      onUpdate(coverImage);
      onClose();
    }
  };

  const handleClose = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setCoverImage(null);
    setPreview(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      PaperProps={{
        style: {
          width: '800px',
          margin: 16,
          borderRadius: 12,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle>Update Cover Image</DialogTitle>
      <DialogContent>
        <div className={`upload-content ${!preview ? 'no-previews' : ''}`}>
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>Drag and drop a cover image here, or click to select</p>
            <p>Supported formats: JPG, JPEG, PNG</p>
          </div>

          {preview && (
            <div className="preview-wrapper" style={{ width: '100%', height: '200px' }}>
              <img 
                src={preview} 
                alt="Cover preview" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          disabled={!coverImage}
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CoverImageModal;
