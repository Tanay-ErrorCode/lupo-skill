// src/components/EventBannerUpload/EventBannerUpload.tsx
import React from 'react';
import { Card,  Button } from 'react-bootstrap';
import Typography from '@mui/material/Typography';

import './EventBannerUpload.css'; // Assuming you have a CSS file for styling

interface EventBannerUploadProps {
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string | null;
}

const EventBannerUpload: React.FC<EventBannerUploadProps> = ({ handleImageChange, imagePreview }) => {
  return (
    <Card className="upload-box">
      <Typography variant="h6" className="upload-box-head">
        Upload Event Banner
      </Typography>
      <div className="upload-content">
        <Button variant="outline-primary" as="label">
          + Upload
          <input type="file" accept="image/*" onChange={handleImageChange} hidden />
        </Button>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Uploaded Preview"
            className="mt-4 preview-image"
          />
        )}
      </div>
    </Card>
  );
};

export default EventBannerUpload;
