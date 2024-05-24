import React, { useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button } from "react-bootstrap";

interface ImageCropperProps {
  src: string;
  setCroppedImageUrl: (url: string | null) => void; // Allow null for unset value
}

// Define a type for the Cropper instance
type CropperElement = HTMLImageElement & {
  cropper: Cropper;
};

const ImageCropper: React.FC<ImageCropperProps> = ({
  src,
  setCroppedImageUrl,
}) => {
  const cropperRef = useRef<CropperElement>(null); // Use ref to access Cropper instance

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper; // Access cropper instance
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      const croppedImageUrl = croppedCanvas ? croppedCanvas.toDataURL() : null; // Handle case when croppedCanvas is null
      setCroppedImageUrl(croppedImageUrl);
    }
  };

  return (
    <div>
      <Cropper
        src={src}
        style={{ height: 400, width: "100%" }}
        initialAspectRatio={1}
        aspectRatio={1}
        guides={false}
        ref={cropperRef} // Use ref to access the cropper instance
      />
      <Button
        className="mt-5 text-center items-center"
        variant="primary"
        onClick={handleCrop}
      >
        Confirm
      </Button>
    </div>
  );
};

export default ImageCropper;
