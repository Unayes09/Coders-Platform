import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const AdminLoginPage = () => {
  const [secretKey, setSecretKey] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedKey = import.meta.env.VITE_REACT_APP_ADMIN_CP_SK;
    console.log(storedKey)
    if (secretKey === storedKey) {
      navigate('/admin'); // Navigate to the system admin page
    } else {
      toast.error('Wrong key provided!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black ">
      <Toaster />
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Enter Admin Key</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            placeholder="Enter secret key"
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
