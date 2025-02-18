import { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import { Trash2 } from "lucide-react";

const EventImageUploader = ({
  onImageSelect,
  autoSelectFirst,
  existingImageId,
}) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchUploadedImages();
  }, []);

  const fetchUploadedImages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/images/event-images`, {
        withCredentials: true,
      });

      const images = response.data.images || [];
      setUploadedImages(images);

      if (images.length > 0) {
        if (autoSelectFirst) {
          setSelectedImage(images[0]._id);
          onImageSelect(images[0]._id);
        } else if (existingImageId) {
          setSelectedImage(existingImageId);
          onImageSelect(existingImageId);
        }
      } else {
        setSelectedImage(null);
        onImageSelect(null);
      }
    } catch (err) {
      console.error("Failed to fetch images", err);
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/images/upload/event-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      const newImage = res.data.image;
      setUploadedImages((prev) => [...prev, newImage]);
      handleSelect(newImage._id);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleDelete = async (imageId, e) => {
    e.stopPropagation(); // Prevent selecting image when clicking delete

    if (
      !window.confirm(
        "Are you sure you want to delete this image? It may affect existing events."
      )
    )
      return;

    try {
      await axios.delete(`${BASE_URL}/api/images/event-images/${imageId}`, {
        withCredentials: true,
      });

      setUploadedImages((prev) => prev.filter((img) => img._id !== imageId));

      if (selectedImage === imageId) {
        const remainingImages = uploadedImages.filter(
          (img) => img._id !== imageId
        );
        const newSelected =
          remainingImages.length > 0 ? remainingImages[0]._id : null;

        setSelectedImage(newSelected);
        onImageSelect(newSelected);
      }
    } catch (err) {
      console.error("Failed to delete image", err);
    }
  };

  const handleSelect = (imageId) => {
    setSelectedImage(imageId);
    onImageSelect(imageId);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Upload or Select an Event Image
      </h2>

      {/* Dropzone for Image Upload */}
      <Dropzone onDrop={(acceptedFiles) => handleUpload(acceptedFiles[0])}>
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-all"
          >
            <input {...getInputProps()} />
            <p className="text-gray-600">
              Upload new image here: Drag & Drop, or click here to add
            </p>
          </div>
        )}
      </Dropzone>

      {/* Image Selection */}
      {uploadedImages.length > 0 && (
        <h3 className="text-lg font-medium text-gray-800 mt-6">
          Previously Uploaded Images
        </h3>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {uploadedImages.map((img) => (
          <div
            key={img._id}
            className={`relative rounded-lg overflow-hidden shadow-sm border ${
              selectedImage === img._id ? "border-blue-500" : "border-gray-300"
            } hover:border-blue-500 transition-all cursor-pointer`}
            onClick={() => handleSelect(img._id)}
          >
            <img
              src={img.url}
              alt="event banner"
              className="w-full h-24 object-cover rounded-md"
            />

            {/* Trash Icon for Deletion */}
            <button
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-700 transition z-20"
              onClick={(e) => handleDelete(img._id, e)}
            >
              <Trash2 size={16} />
            </button>

            {/* "Selected" Overlay - Fix z-index so delete button is clickable */}
            {selectedImage === img._id && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-50 z-10">
                <span className="text-white font-semibold">Selected</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventImageUploader;
