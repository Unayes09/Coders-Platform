import React, { useState, useEffect } from 'react';
import axios from "../../utils/axiosInstance";
import toast from 'react-hot-toast';

const StoriesTab = () => {
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await axios.get('/api/stories/all');
      setStories(response.data);
    } catch (error) {
      toast.error('Failed to load stories');
    }
  };

  const handleEdit = async (id, updatedStory) => {
    try {
      await axios.put(`/api/stories/${id}`, updatedStory);
      toast.success('Story updated successfully');
      fetchStories();
    } catch (error) {
      toast.error('Failed to update story');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Search stories..."
      />
      <div className="grid grid-cols-1 gap-4 text-black">
        {stories
          .filter(story => 
            Object.values(story)
              .some(val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())))
          .map((story, idx) => (
            <div key={idx} className="p-4 bg-white rounded shadow-md">
              <p><strong>Email: </strong>{story.email}</p>
              <p><strong>Created At: </strong>{new Date(story.createdAt).toLocaleString()}</p>
              <p><strong>Description: </strong>{story.description}</p>
              
              <button
                onClick={() => handleEdit(story.id, story)}
                className="p-2 bg-red-500 text-white rounded m-2"
              >
                Delete
              </button>
            </div>
        ))}
      </div>
    </div>
  );
};

export default StoriesTab;
