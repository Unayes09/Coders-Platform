import React, { useState, useContext, useEffect } from 'react';
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../providers/UserProvider";
import Story from './Story';
import CreateStory from './CreateStory';

const StoryFeed = () => {
    const [stories, setStories] = useState([]);
    const { user } = useContext(UserContext);

    const fetchStories = async () => {
        try {
            const response = await axiosInstance.get('/api/stories/all');
            setStories(response.data.reverse());
        } catch (error) {
            console.error('Error fetching stories:', error);
        }
    };

    useEffect(() => {
        fetchStories();
    }, []);

    return (

        <div>
            {/* CreateStory component */}
          <CreateStory fetchStories={fetchStories}/>

            <div className="space-y-6">
                {stories.map((story) => (
                    <Story key={story.id} story={story} fetchStories={fetchStories} />
                ))}
            </div>
        </div>
    );
};

export default StoryFeed;
