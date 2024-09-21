import React, { useState, useEffect } from 'react';
import axios from "../../utils/axiosInstance";
import toast from 'react-hot-toast';

const JobsTab = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/jobs');
      setJobs(response.data);
    } catch (error) {
      toast.error('Failed to load jobs');
    }
  };

  const handleEdit = async (id, updatedJob) => {
    try {
      await axios.put(`/api/jobs/${id}`, updatedJob);
      toast.success('Job updated successfully');
      fetchJobs();
    } catch (error) {
      toast.error('Failed to update job');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Search jobs..."
      />
      <div className="grid grid-cols-1 gap-4 text-black">
        {jobs
          .filter(job => 
            Object.values(job)
              .some(val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())))
          .map((job, idx) => (
            <div key={idx} className="p-4 bg-white rounded shadow-md">
              <p><strong>Email: </strong>{job.email}</p>
              <p><strong>Title: </strong>{job.title}</p>
              
              <button
                onClick={() => handleEdit(job.id, job)}
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

export default JobsTab;
