import React, { useState, useContext } from 'react';
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../providers/UserProvider";

const CommentModal = ({ story, onClose, fetchStories }) => {
    const { user } = useContext(UserContext);
    const [commentText, setCommentText] = useState('');

    const handleAddComment = async () => {
        try {
            const commentData = {
                commentText,
                commenterName: user.fullName,
                commenterEmail: user.email
            };
            await axiosInstance.post(`/api/stories/${story.id}/comment`, commentData, { params: { token: user.token } });
            fetchStories();
            setCommentText('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteComment = async (comment) => {
        try {
            await axiosInstance.delete(`/api/stories/${story.id}/comment`, {
                data: comment,
                params: { token: user.token }
            });
            fetchStories();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-md shadow-md w-96">
                <button className="text-red-500 float-right" onClick={onClose}>
                    Close
                </button>
                <h3 className="text-lg font-bold mb-2 text-black">Comments</h3>
                <div className="space-y-4 mb-4">
                    {story.comments.map((comment, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <p className='text-black'><span className='text-gray-600'>{comment.commenterName}</span>: {comment.commentText}</p>
                            {(comment.commenterEmail === user.email || story.email === user.email) && (
                                <button onClick={() => handleDeleteComment(comment)} className="text-red-500">
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full border p-2 mb-2"
                    placeholder="Add a comment..."
                />
                <button onClick={handleAddComment} className="bg-blue-500 text-white py-2 px-4 rounded-md w-full">
                    Add Comment
                </button>
            </div>
        </div>
    );
};

export default CommentModal;
