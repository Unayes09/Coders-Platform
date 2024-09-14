import React from 'react';

const EventDetailsModal = ({ event, closeModal }) => {
  console.log(event)
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-black">
        <h2 className="text-xl font-bold mb-4">{event.eventTitle}</h2>
        <p>{event.description}</p>
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
