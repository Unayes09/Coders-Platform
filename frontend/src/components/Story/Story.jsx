import React, { useState, useContext } from 'react';
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../providers/UserProvider";
import CommentModal from './CommentModal';
import userAvatar from "../../assets/images/avatar.png";

const Story = ({ story, fetchStories }) => {
    const { user } = useContext(UserContext);
    const [showModal, setShowModal] = useState(false);

    const handleDelete = async () => {
        // Confirmation before deleting the story
        const confirmDelete = window.confirm('Are you sure you want to delete this story?');
        if (!confirmDelete) return;

        try {
            await axiosInstance.delete(`/api/stories/delete/${story.id}`, { params: { token: user.token } });
            fetchStories(); // Refresh the stories list
        } catch (error) {
            console.error('Error deleting story:', error);
        }
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-md">
            <div className="flex items-center mb-2">
                <img
                    src={story.userPictureLink}
                    className="w-10 h-10 rounded-full mr-2"
                    onError={(e) => e.target.src = userAvatar} // Fallback to userAvatar on error
                    alt="User Avatar"
                />
                <div>
                    <p className="font-bold text-2xl text-purple-700">{story.name}</p>
                    <p className="text-sm text-gray-500">{new Date(story.createdAt).toLocaleString()}</p>
                </div>
                {user && story.email === user.email && (
                    <button onClick={handleDelete} className="ml-auto text-red-500">
                        Delete
                    </button>
                )}
            </div>
            <p className="mb-4 text-black text-xl">{story.description}</p>
            <div className="flex space-x-2 overflow-x-scroll">
                {story.imageLinks.map((link, index) => (
                    <img key={index} src={link} alt={`Story image ${index}`} className="w-40 h-40 object-cover" />
                ))}
            </div>
            <button onClick={() => setShowModal(true)} className="mt-4 text-blue-500">
                Comments
            </button>
            {showModal && <CommentModal story={story} onClose={() => setShowModal(false)} fetchStories={fetchStories} />}
        </div>
    );
};

export default Story;
