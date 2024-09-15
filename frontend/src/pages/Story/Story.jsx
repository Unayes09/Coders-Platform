import React, { useContext, useState } from 'react';
import CreateStory from '../../components/Story/CreateStory';
import StoryFeed from '../../components/Story/StoryFeed';
import MyStories from '../../components/Story/MyStories';
import { UserContext } from '../../providers/UserProvider'; // Assuming the UserContext is here

const Story = () => {
  const { user } = useContext(UserContext); // Get user and isLoggedIn from UserContext
  const [showMyStories, setShowMyStories] = useState(false);

  const toggleStories = () => {
    setShowMyStories(!showMyStories); // Toggle between All Stories and My Stories
  };

  return (
    <div className="container mx-auto p-4">
      {/* Check if the user is logged in */}
      {user ? (
        <>
          
          {/* Toggle button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleStories}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              {showMyStories ? 'All Stories' : 'My Stories'}
            </button>
          </div>

          {/* Conditionally render MyStories or StoryFeed */}
          {showMyStories ? <MyStories /> : <StoryFeed />}
        </>
      ) : (
        // Show a message if the user is not logged in
        <div className="text-center text-red-500">
          Please log in to view and create stories.
        </div>
      )}
    </div>
  );
};

export default Story;
