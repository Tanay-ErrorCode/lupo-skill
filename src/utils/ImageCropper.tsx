import React, { useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button } from "react-bootstrap";

interface ImageCropperProps {
  src: string;
  setCroppedImageUrl: (url: string | null) => void;
  aspectRatio: number;
}

type CropperElement = HTMLImageElement & {
  cropper: Cropper;
};

const ImageCropper: React.FC<ImageCropperProps> = ({
  src,
  setCroppedImageUrl,
  aspectRatio,
}) => {
  const cropperRef = useRef<CropperElement>(null);

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      const croppedImageUrl = croppedCanvas ? croppedCanvas.toDataURL() : null;
      setCroppedImageUrl(croppedImageUrl);
    }
  };

  return (
    <div>
      <Cropper
        src={src}
        style={{ height: 400, width: "100%" }}
        aspectRatio={aspectRatio}
        guides={false}
        ref={cropperRef}
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
