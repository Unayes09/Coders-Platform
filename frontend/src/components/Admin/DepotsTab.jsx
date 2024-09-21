import React, { useState, useEffect } from 'react';
import axios from "../../utils/axiosInstance";
import toast from 'react-hot-toast';

const DepotsTab = () => {
  const [depots, setDepots] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDepots();
  }, []);

  const fetchDepots = async () => {
    try {
      const response = await axios.get('/api/repos/public');
      setDepots(response.data);
    } catch (error) {
      toast.error('Failed to load depots');
    }
  };

  const handleEdit = async (id, updatedDepot) => {
    try {
      const res = await axios.delete(`/api/repos/${id}?token=admin`);
      //console.log(res);
      toast.success('Depot deleted successfully');
      fetchDepots();
    } catch (error) {
      toast.error('Failed to delete depot');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Search depots..."
      />
      <div className="grid grid-cols-1 gap-4 text-black">
        {depots
          .filter(depot => 
            Object.values(depot)
              .some(val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())))
          .map((depot, idx) => (
            <div key={idx} className="p-4 bg-white rounded shadow-md">
              <p><strong>Depot Name: </strong>{depot.repoName}</p>
              <p><strong>Description: </strong>{depot.repoDescription}</p>
              
              <button
                onClick={() => handleEdit(depot.id, depot)}
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

export default DepotsTab;
