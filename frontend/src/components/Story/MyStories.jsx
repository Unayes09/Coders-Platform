import React, { useState, useContext, useEffect } from 'react';
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../providers/UserProvider";
import Story from './Story';
import CreateStory from './CreateStory';

const MyStories = () => {
    const [stories, setStories] = useState([]);
    const { user } = useContext(UserContext);

    const fetchMyStories = async () => {
        if (!user) {
            return;
        }

        try {
            const response = await axiosInstance.get(`/api/stories/user/${user.email}`);
            setStories(response.data.reverse());
        } catch (error) {
            console.error('Error fetching user stories:', error);
        }
    };

    useEffect(() => {
        fetchMyStories();
    }, [user]);

    if (!user) {
        return <p>Please log in to see your stories.</p>;
    }

    return (
        <div>
            {/* CreateStory component */}
          <CreateStory fetchStories={fetchMyStories}/>

            <div className="space-y-6">
                {stories.length === 0 ? (
                    <p>You have no stories.</p>
                ) : (
                    stories.map((story) => (
                        <Story key={story.id} story={story} fetchStories={fetchMyStories} />
                    ))
                )}
            </div>
        </div>
    );
};

export default MyStories;
