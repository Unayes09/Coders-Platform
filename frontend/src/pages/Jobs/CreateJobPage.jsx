import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../providers/UserProvider";
import userAvatar from "../../assets/images/avatar.png";

const CreateJobPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    tags: '',
    type: 'remote',
    time: 'full-time',
    salary: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (skill = '') => {
    try {
      const response = await axiosInstance.get('/api/jobs/users/search', {
        params: { skill }
      });
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateJob = async () => {
    if (!user) {
      alert("Please login to create a job.");
      return;
    }
    try {
      await axiosInstance.post(`/api/jobs?token=${user.token}`, {
        ...jobData,
        name: user.fullName,
        email: user.email
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchUsers = () => {
    fetchUsers(searchTerm);
  };

  return (
    <div className="p-8">
      <button 
        onClick={() => setShowCreateModal(true)} 
        className="bg-green-500 text-white px-4 py-2 rounded-md my-2 w-full sm:w-1/6"
      >
        Create Job
      </button>

      {/* Search Bar for Users */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <input 
          type="text" 
          placeholder="Search users by skill..." 
          className="p-2 border rounded-md w-3/4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearchUsers} className="bg-blue-500 text-white px-4 py-2 rounded-md w-full md:w-auto">
          Search Users
        </button>
      </div>

      {/* User List */}
        <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <div key={user.id} className="sm:flex items-center p-4 border rounded-md">
            {/* <div className='flex'> */}
                <img 
                src={user.image} 
                onError={(e) => e.target.src = userAvatar} 
                className="w-16 h-16 rounded-full"
                />
                <div className="ml-4 flex-1">
                <h2 className="text-xl font-bold">{user.fullName}</h2>
                <p>@{user.username}</p>
                <p>Skills: {user.skills.join(', ')}</p>
                </div>
            {/* </div> */}
            
            {/* Buttons for Send Message and View Profile */}
            <div className="space-x-2">
              <button 
                onClick={() => navigate(`/chat`)}
                className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Send Message
              </button>
              <button 
                onClick={() => navigate(`/profile/${user.id}`)}
                className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md relative w-full max-w-lg">
            {/* Close (Cross) Button */}
            <button 
              onClick={() => setShowCreateModal(false)} 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>
            
            <h2 className="text-2xl mb-4 text-black">Create a Job</h2>
            
            <input 
              type="text" 
              placeholder="Job Title" 
              className="p-2 border w-full mb-4"
              value={jobData.title}
              onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
            />
            
            <textarea 
              placeholder="Job Description" 
              className="p-2 border w-full mb-4"
              value={jobData.description}
              onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
            />
            
            <input 
              type="text" 
              placeholder="Job Tags (comma-separated)" 
              className="p-2 border w-full mb-4"
              value={jobData.tags}
              onChange={(e) => setJobData({ ...jobData, tags: e.target.value.split(',') })}
            />
            
            <select 
              className="p-2 border w-full mb-4" 
              value={jobData.type}
              onChange={(e) => setJobData({ ...jobData, type: e.target.value })}
            >
              <option value="remote">Remote</option>
              <option value="on-site">On-Site</option>
            </select>
            
            <select 
              className="p-2 border w-full mb-4" 
              value={jobData.time}
              onChange={(e) => setJobData({ ...jobData, time: e.target.value })}
            >
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
            </select>
            
            <input 
              type="text" 
              placeholder="Salary" 
              className="p-2 border w-full mb-4"
              value={jobData.salary}
              onChange={(e) => setJobData({ ...jobData, salary: e.target.value })}
            />
            
            <button 
              onClick={handleCreateJob} 
              className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
            >
              Create Job
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateJobPage;
