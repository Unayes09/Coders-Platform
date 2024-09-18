import React, { useState } from 'react';
import axiosInstance from "../../utils/axiosInstance";
import axios from 'axios';

const EventCreationModal = ({ closeModal }) => {
  const [eventTitle, setTitle] = useState('');
  const [createdAt, setTime] = useState('');
  const [imageLink, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null); // New state to handle the image file
  const [isUploading, setIsUploading] = useState(false); // To track upload progress

  // Function to upload image to ImgBB and get the URL
  const uploadImageToImgBB = async (image) => {
    const imgbbApiKey = '4fd69f848676bd5bafb3282630581000'; // Replace with your ImgBB API key
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, formData);
      return response.data.data.url;
    } catch (error) {
      console.error('Error uploading image to ImgBB:', error);
      return null;
    }
  };

  // Handle event creation with image upload
  const handleSubmit = async () => {
    if (!imageFile) {
      console.error('No image file selected');
      return;
    }

    setIsUploading(true); // Set uploading state
    const uploadedImageUrl = await uploadImageToImgBB(imageFile);

    if (uploadedImageUrl) {
      // Once the image is uploaded, create the event with the image URL
      axiosInstance.post('/api/events/create', {
        eventTitle,
        createdAt,
        imageLink: uploadedImageUrl,
        description,
      })
        .then(() => {
          closeModal();
          window.location.reload(); // Reload the page to show the new event
        })
        .catch((error) => console.error('Error creating event:', error));
    } else {
      console.error('Failed to upload image');
    }

    setIsUploading(false); // Reset uploading state
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-black">Create Event</h2>
        
        <input
          type="text"
          placeholder="Event Title"
          className="w-full mb-2 p-2 border border-gray-300 rounded"
          value={eventTitle}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <input
          type="datetime-local"
          className="w-full mb-2 p-2 border border-gray-300 rounded"
          value={createdAt}
          onChange={(e) => setTime(e.target.value)}
        />
        
        <input
          type="file"
          className="w-full mb-2 p-2 text-black"
          onChange={(e) => setImageFile(e.target.files[0])} // Handle file input
        />
        
        <textarea
          placeholder="Description"
          className="w-full mb-2 p-2 border border-gray-300 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            onClick={closeModal}
          >
            Cancel
          </button>
          
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
            disabled={isUploading} // Disable while uploading
          >
            {isUploading ? 'Uploading...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCreationModal;
