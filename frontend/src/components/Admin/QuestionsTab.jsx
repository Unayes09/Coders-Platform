import React, { useState, useEffect } from 'react';
import axios from "../../utils/axiosInstance";
import toast from 'react-hot-toast';

const QuestionsTab = () => {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/qna/questions');
      setQuestions(response.data);
    } catch (error) {
      toast.error('Failed to load questions');
    }
  };

  const handleEdit = async (id, updatedQuestion) => {
    try {
      await axios.put(`/api/questions/${id}`, updatedQuestion);
      toast.success('Question updated successfully');
      fetchQuestions();
    } catch (error) {
      toast.error('Failed to update question');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Search questions..."
      />
      <div className="grid grid-cols-1 gap-4 text-black">
        {questions
          .filter(question => 
            Object.values(question)
              .some(val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())))
          .map((question, idx) => (
            <div key={idx} className="p-4 bg-white rounded shadow-md">
              <p><strong>Email: </strong>{question.email}</p>
              <p><strong>Question: </strong>{question.question}</p>
              
              <button
                onClick={() => handleEdit(question.id, question)}
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

export default QuestionsTab;
