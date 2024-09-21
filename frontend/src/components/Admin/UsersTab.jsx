import React, { useState, useEffect } from 'react';
import axios from "../../utils/axiosInstance";
import toast from 'react-hot-toast';

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (skill = '') => {
    try {
      const response = await axios.get(`/api/jobs/users/search`,{
        params: { skill }
      });
      console.log(response)
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const handleEdit = async (id, updatedUser) => {
    try {
      await axios.put(`/api/users/${id}`, updatedUser);
      toast.success('User updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Search users..."
      />
      <div className="grid grid-cols-1 gap-4 text-black">
        {users
          .filter(user => 
            Object.values(user)
              .some(val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())))
          .map((user, idx) => (
            <div key={idx} className="p-4 bg-white rounded shadow-md">
              <p><strong>Username: </strong>{user.username}</p>
              <p><strong>Email: </strong>{user.email}</p>
              <p><strong>Full Name: </strong>{user.fullName}</p>
              <p><strong>Premium Pack: </strong>{user.premiumPackBuyDate}</p>
              
              <button
                onClick={() => handleEdit(user.id, user)}
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

export default UsersTab;
