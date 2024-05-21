import { Crop } from "react-image-crop";

export const getCroppedImg = async (
  image: HTMLImageElement,
  crop: Crop,
  fileName: string
): Promise<string | null> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    //console.error('Canvas context is invalid');
    return null;
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width ?? 0;
  canvas.height = crop.height ?? 0;

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    (crop.width ?? 0) * scaleX,
    (crop.height ?? 0) * scaleY,
    0,
    0,
    crop.width ?? 0,
    crop.height ?? 0
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        //console.error('Canvas is empty');
        return null;
      }
      // Create a new File object with the desired name
      const file = new File([blob], fileName, { type: "image/jpeg" });
      resolve(window.URL.createObjectURL(file));
    }, "image/jpeg");
  });
};
