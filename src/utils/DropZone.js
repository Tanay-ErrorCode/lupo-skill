import React, { useRef, useState } from 'react';


const DropZone = ({ handleImageChange }) => {
  const fileInputRef = useRef(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      setIsImageUploaded(true);
    }
    handleImageChange({ target: { files } });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
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
        style={{ display: 'none' }}
      />
      { <p className="dropzone">+ Upload</p>}
    </div>
  );
};

export default DropZone;
