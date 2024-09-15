import React, { useState, useContext } from 'react';
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../providers/UserProvider";
import axios from 'axios';

const CreateStory = ({ fetchStories }) => {
    const { user } = useContext(UserContext);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state

    const handleImageUpload = async () => {
        const imgbbKey = '4fd69f848676bd5bafb3282630581000';
        const imageUrls = [];

        for (let image of images) {
            const formData = new FormData();
            formData.append('image', image);

            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, formData);
            imageUrls.push(response.data.data.url);
        }

        return imageUrls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please log in first');
            return;
        }

        setLoading(true); // Set loading state to true when submitting

        try {
            const imageLinks = await handleImageUpload();
            const storyData = {
                name: user.fullName,
                userPictureLink: user.image,
                email: user.email,
                description,
                imageLinks
            };
            await axiosInstance.post('/api/stories/create', storyData, { params: { token: user.token } });
            fetchStories();
            setDescription('');
            setImages([]);
        } catch (error) {
            console.error('Error creating story:', error);
        } finally {
            setLoading(false); // Reset loading state after completion
        }
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-md mb-6">
            <form onSubmit={handleSubmit}>
                <textarea
                    className="w-full border border-gray-300 p-2 rounded-md mb-4 text-white"
                    placeholder="Hey Coder? Where are you?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="file"
                    multiple
                    onChange={(e) => setImages([...e.target.files])}
                    className="mb-4 text-black"
                />
                <button
                    className={`py-2 px-4 rounded-md ${loading ? 'bg-gray-500' : 'bg-blue-500'} text-white`}
                    type="submit"
                    disabled={loading} // Disable the button while loading
                >
                    {loading ? 'Creating...' : 'Create Story'} {/* Change button text based on loading state */}
                </button>
            </form>
        </div>
    );
};

export default CreateStory;
