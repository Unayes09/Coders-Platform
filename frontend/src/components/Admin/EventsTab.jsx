import React, { useState, useEffect } from 'react';
import axios from "../../utils/axiosInstance";
import toast from 'react-hot-toast';

const EventsTab = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events/all');
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to load events');
    }
  };

  const handleEdit = async (id, updatedEvent) => {
    try {
      await axios.put(`/api/events/${id}`, updatedEvent);
      toast.success('Event updated successfully');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to update event');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Search events..."
      />
      <div className="grid grid-cols-1 gap-4 text-black">
        {events
          .filter(event => 
            Object.values(event)
              .some(val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())))
          .map((event, idx) => (
            <div key={idx} className="p-4 bg-white rounded shadow-md">
              <p><strong>Email: </strong>{event.email}</p>
              <p><strong>Event Title: </strong>{event.eventTitle}</p>
              
              <button
                onClick={() => handleEdit(event.id, event)}
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

export default EventsTab;
