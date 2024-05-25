import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { Area } from "react-easy-crop/types"; // Import the necessary types

interface ImageCropperProps {
  src: string;
  setCroppedImageUrl: (url: string | null) => void;
  aspectRatio: number;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  src,
  setCroppedImageUrl,
  aspectRatio,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null); // Define type for croppedAreaPixels

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      // Define types for parameters
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCrop = async () => {
    if (croppedAreaPixels) {
      const croppedImageUrl = await getCroppedImg(src, croppedAreaPixels);
      setCroppedImageUrl(croppedImageUrl);
    }
  };

  const getCroppedImg = (
    imageSrc: string,
    crop: Area
  ): Promise<string | null> => {
    const image = new Image();
    image.src = imageSrc;
    return new Promise((resolve, reject) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (ctx) {
          const scaleX = image.naturalWidth / image.width;
          const scaleY = image.naturalHeight / image.height;
          canvas.width = crop.width;
          canvas.height = crop.height;
          ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
          );
          resolve(canvas.toDataURL("image/jpeg"));
        } else {
          reject(null);
        }
      };
      image.onerror = () => {
        reject(null);
      };
    });
  };

  return (
    <div>
      <div style={{ position: "relative", width: "100%", height: 450 }}>
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
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
