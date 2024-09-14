import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../providers/UserProvider";
import EventCreationModal from '../../components/Event/EventCreationModal';
import EventDetailsModal from '../../components/Event/EventDetailsModal';
import { MdDelete } from "react-icons/md";

const EventPage = () => {
  const { user, isUserLoading } = useContext(UserContext); 
  const [events, setEvents] = useState([]);
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showMyEvents, setShowMyEvents] = useState(false); // Toggle between My Events and All Events
  console.log(user);
  // Fetch all events or user-specific events based on the toggle
  useEffect(() => {
    const fetchEvents = () => {
      const apiUrl = showMyEvents
        ? `/api/events/user/${user.email}` // Fetch user's events
        : '/api/events/all';              // Fetch all events
      axiosInstance.get(apiUrl)
        .then((response) => {
          setEvents(response.data);
        })
        .catch((error) => console.error('Error fetching events:', error));
    };

    if (user) {
      fetchEvents();
    }
  }, [user, showMyEvents]); // Refetch data when the user changes or when toggle is switched

  // Mark an event as interested
  const handleMarkInterested = (eventId) => {
    axiosInstance.post(`/api/events/interested/${eventId}?email=${user.email}`)
      .then(() => {
        setEvents(events.map(event =>
          event.id === eventId ? { ...event, interestedPeople: [...event.interestedPeople, user.email], interestedCount: event.interestedCount + 1 } : event
        ));
        window.location.reload();
      })
      .catch((error) => console.error('Error marking interested:', error));
  };

  // Unmark interested
  const handleUnmarkInterested = (eventId) => {
    axiosInstance.post(`/api/events/uninterested/${eventId}?email=${user.email}`)
      .then(() => {
        setEvents(events.map(event =>
          event.id === eventId ? { ...event, interestedPeople: event.interestedPeople.filter(email => email !== user.email), interestedCount: event.interestedCount - 1 } : event
        ));
        window.location.reload();
      })
      .catch((error) => console.error('Error unmarking interested:', error));
  };

  // Delete event
  const handleDeleteEvent = (eventId) => {
    axiosInstance.delete(`/api/events/delete/${eventId}?token=${user.token}`)
      .then(() => {
        // setEvents(events.filter(event => event.id !== eventId));
        // console.log('Event deleted successfully');
        window.location.reload();
      })
      .catch((error) => console.error('Error deleting event:', error));
  };

  const openDetailsModal = (event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => setShowDetailsModal(false);

  // Toggle between showing My Events and All Events
  const toggleEventView = () => {
    setShowMyEvents(!showMyEvents);
  };

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-semibold">Please log in first</div>;
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">{showMyEvents ? "My Events" : "All Events"}</h1>
        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
            onClick={() => setShowCreationModal(true)}
          >
            Create Event
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={toggleEventView}
          >
            {showMyEvents ? "All Events" : "My Events"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {events.map((event) => (
          <div key={event.id} className="bg-gray-400 p-4 rounded-lg shadow-md relative">
            {/* Conditionally render delete icon if event.email === user.email */}
            {event.email === user.email && (
              <button
                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                onClick={() => {handleDeleteEvent(event.id);console.log("button clicked")}}
              >
                <MdDelete className="w-6 h-6" />
              </button>
            )}

            <h2 className="text-xl font-semibold text-black">{event.eventTitle}</h2>
            <p className="text-gray-600">{new Date(event.createdAt).toLocaleString()}</p>
            <img src={event.imageLink} alt={event.eventTitle} className="w-full h-48 object-cover my-4" />
            <button
              className="px-4 py-2 m-4 rounded bg-blue-500 text-white"
              onClick={() => openDetailsModal(event)}
            >
              Show More
            </button>

            <button
              className={`px-4 py-2 rounded ${event.interestedPeople.includes(user.email) ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}
              onClick={() => event.interestedPeople.includes(user.email)
                ? handleUnmarkInterested(event.id)
                : handleMarkInterested(event.id)}
            >
              {event.interestedPeople.includes(user.email) ? 'Interested' : 'Mark Interested'}
            </button>
          </div>
        ))}
      </div>

      {/* Event Creation Modal */}
      {showCreationModal && <EventCreationModal closeModal={() => setShowCreationModal(false)} />}
      {/* Event Details Modal */}
      {showDetailsModal && <EventDetailsModal event={selectedEvent} closeModal={closeDetailsModal} />}
    </div>
  );
};

export default EventPage;
