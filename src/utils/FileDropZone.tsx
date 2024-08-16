import React, { useRef, useState, ChangeEvent, DragEvent } from "react";
import { toast, Zoom } from "react-toastify";

interface DropZoneProps {
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FileDropZone: React.FC<DropZoneProps> = ({ handleFileChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0 && validateFiles(files)) {
      setIsFileUploaded(true);
      handleFileChange({ target: { files } } as ChangeEvent<HTMLInputElement>);
    } else {
      resetInputField();
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && validateFiles(files)) {
      setIsFileUploaded(true);
      handleFileChange(event);
    } else {
      resetInputField();
    }
  };

  const validateFiles = (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = file.type;
      if (
        fileType !== "application/pdf" &&
        !fileType.includes("presentation")
      ) {
        toast.error("Only PDF and PPT files are allowed.", {
          transition: Zoom,
        });
        return false;
      }
    }
    return true;
  };

  const resetInputField = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsFileUploaded(false);
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
        accept=".pdf, .ppt, .pptx"
        ref={fileInputRef}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      {!isFileUploaded && <p className="dropzone">+ Upload PDF or PPT</p>}
      {isFileUploaded && <p className="drop">Change File</p>}
    </div>
  );
};

export default FileDropZone;
