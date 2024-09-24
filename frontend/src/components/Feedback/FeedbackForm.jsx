import React, { useState, useContext } from 'react';
import axios from "../../utils/axiosInstance"; // for API calls
import { UserContext } from "../../providers/UserProvider";

const FeedbackForm = () => {
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const { user, isUserLoading } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description) {
      setMessage('Please enter a description');
      return;
    }

    try {
      const response = await axios.post('/api/feedback/send', { name:user?.name, email:user?.email,description });
      if (response.status === 200) {
        setMessage('Feedback submitted successfully');
        setDescription(''); // Clear the input after successful submission
      } else {
        setMessage('Failed to submit feedback');
      }
    } catch (error) {
      setMessage('An error occurred while submitting feedback');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-4">Submit Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Feedback
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="4"
            placeholder="Enter your feedback"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        >
          Submit
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
    </div>
  );
};

export default FeedbackForm;
