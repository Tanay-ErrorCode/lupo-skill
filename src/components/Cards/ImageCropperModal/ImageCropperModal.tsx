// src/components/ImageCropperModal/ImageCropperModal.tsx
import React from 'react';
import { Modal } from 'react-bootstrap';
import ImageCropper from '../../../utils/ImageCropper';

interface ImageCropperModalProps {
  show: boolean;
  onHide: () => void;
  imagePreview: string;
  cropperAspectRatio: number;
  handleSaveCroppedImage: (croppedImageUrl: string | null) => void;
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  show, onHide, imagePreview, cropperAspectRatio, handleSaveCroppedImage
}) => {
  return (
    <Modal show={show} onHide={onHide} animation={true}>
      <Modal.Header closeButton>
        <Modal.Title>Crop Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {imagePreview && (
          <ImageCropper
            setCroppedImageUrl={handleSaveCroppedImage}
            src={imagePreview}
            aspectRatio={cropperAspectRatio}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ImageCropperModal;
