import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../providers/UserProvider";

const JobSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null); // State for selected job
  const [showModal, setShowModal] = useState(false);    // State for modal visibility
  const [showMyJobs, setShowMyJobs] = useState(false);  // State to toggle between all jobs and user's jobs
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Fetch all jobs initially or after search
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (term = '') => {
    try {
      const response = await axiosInstance.get(`/api/jobs/search`, {
        params: { searchTerm: term }
      });
      setJobs(response.data.reverse());
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = () => {
    fetchJobs(searchTerm);
  };

  const handleCardClick = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
    setShowModal(false);
  };

  const handleDeleteJob = async () => {
    if (!user) {
      alert("Please log in to delete a job.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/api/jobs/${selectedJob.id}`, {
        params: { token: user.token, email: user.email }
      });
      fetchJobs(); // Refresh the job list
      handleCloseModal(); // Close the modal
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  // Filter jobs by user email if "My Jobs" is clicked
  const filteredJobs = showMyJobs && user ? jobs.filter(job => job.email === user.email) : jobs;

  return (
    <div className="p-8">
      <h1 className="text-4xl mb-6">Look for your future</h1>
      
      {/* Search Bar */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <input 
            type="text" 
            placeholder="Search jobs..." 
            className="p-2 border rounded-md w-full md:w-2/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex flex-col md:flex-row w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4">
            <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded-md w-full md:w-auto">
            Search Jobs
            </button>
            <button onClick={() => navigate('/create-job')} className="bg-green-500 text-white px-4 py-2 rounded-md w-full md:w-auto">
            Want Coders?
            </button>
            {user && (
            <button 
                onClick={() => setShowMyJobs(!showMyJobs)} 
                className="bg-yellow-500 text-white px-4 py-2 rounded-md w-full md:w-auto"
            >
                {showMyJobs ? "All Jobs" : "My Jobs"}
            </button>
            )}
        </div>
        </div>


      {/* Job List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredJobs.map((job) => (
          <div 
            key={job.id} 
            className="p-4 border rounded-md cursor-pointer"
            onClick={() => handleCardClick(job)}
          >
            <h2 className="text-2xl font-bold">{job.title}</h2>
            <p>Author: {job.name}</p>
            <p>Tags: {job.tags.join(', ')}</p>
            <p>Type: {job.type} | {job.time}</p>
          </div>
        ))}
      </div>

      {/* Job Modal */}
      {showModal && selectedJob && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-md p-6 w-11/12 md:w-1/2 relative text-black">
            <button 
              onClick={handleCloseModal} 
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedJob.title}</h2>
            <p><strong>Author:</strong> {selectedJob.name}</p>
            <p><strong>Email:</strong> {selectedJob.email}</p>
            <p><strong>Tags:</strong> {selectedJob.tags.join(', ')}</p>
            <p><strong>Type:</strong> {selectedJob.type}</p>
            <p><strong>Time:</strong> {selectedJob.time}</p>
            <p><strong>Salary:</strong> {selectedJob.salary}</p>
            <p className="mt-4"><strong>Description:</strong></p>
            <p>{selectedJob.description}</p>

            {/* Email Button */}
            <a 
              href={`mailto:${selectedJob.email}`} 
              className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Contact via Email
            </a>

            {/* Delete Button */}
            {user && selectedJob.email === user.email && (
              <button 
                onClick={handleDeleteJob} 
                className="mt-4 ml-4 bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Delete Job
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSearchPage;
