import React, { useState, useEffect } from 'react';
import axios from "../../utils/axiosInstance";
import toast from 'react-hot-toast';

const FeedbackTab = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('/api/feedback/get');
      setFeedbacks(response.data);
    } catch (error) {
      toast.error('Failed to load feedback');
    }
  };

  const handleEdit = async (id, updatedFeedback) => {
    try {
      await axios.put(`/api/feedbacks/${id}`, updatedFeedback);
      toast.success('Feedback updated successfully');
      fetchFeedbacks();
    } catch (error) {
      toast.error('Failed to update feedback');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Search feedback..."
      />
      <div className="grid grid-cols-1 gap-4 text-black">
        {feedbacks
          .filter(feedback => 
            Object.values(feedback)
              .some(val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())))
          .map((feedback, idx) => (
            <div key={idx} className="p-4 bg-white rounded shadow-md">
              <p><strong>Email: </strong>{feedback.email}</p>
              <p><strong>Description: </strong>{feedback.description}</p>
              
            </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackTab;
