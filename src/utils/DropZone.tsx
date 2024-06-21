import React, { useRef, useState, ChangeEvent, DragEvent } from "react";

interface DropZoneProps {
  handleImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ handleImageChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      setIsImageUploaded(true);
    }
    handleImageChange({ target: { files } } as ChangeEvent<HTMLInputElement>);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setIsImageUploaded(true);
    }
    handleImageChange(event);
  };

  return (
    <div
      className="border-2 border-dashed border-gray-400 rounded-lg p-6 bg-blue-100 text-center cursor-pointer"
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      {!isImageUploaded && <p className="dropzone">+ Upload</p>}
      {isImageUploaded && <p className="drop">Change</p>}
    </div>
  );
};

export default DropZone;
