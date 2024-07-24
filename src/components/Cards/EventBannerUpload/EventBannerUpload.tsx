// src/components/EventBannerUpload/EventBannerUpload.tsx
import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import DropZone from '../../../utils/DropZone';

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
      <Box>
        <DropZone handleImageChange={handleImageChange} />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Uploaded Preview"
            className="mt-4"
            style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "cover",
            }}
          />
        )}
      </Box>
    </Card>
  );
};

export default EventBannerUpload;
