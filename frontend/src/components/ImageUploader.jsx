import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

const ImageUploader = () => {
  const { uploadProfileImage } = useAuthStore();

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first!");
      return;
    }

    setUploading(true);
    await uploadProfileImage(selectedFile);

    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <input type="file" accept="image/*" onChange={handleFileChange} />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
};

export default ImageUploader;
