import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from "../../providers/UserProvider";
import { useParams } from 'react-router-dom';
import axiosInstance from "../../utils/axiosInstance";
import { isPremiumUser } from "../../utils/dateCalculation";

const ProfilePage = () => {
  const { user } = useContext(UserContext);  // Fetch logged-in user context
  const { userId } = useParams();  // Get userId from route params
  const [userData, setUserData] = useState(null);  // State for storing user data
  const [isEditable, setIsEditable] = useState(false);  // State to check if the user is authorized to edit
  const [activityData, setActivityData] = useState([]);  // State for storing user activity
  const token = localStorage.getItem("token");
  let isPremium = true;
  //console.log(token)
  // Fetch user data from server
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/api/users/${userId}/profile`); // Fetch user data
        setUserData(response.data);
        isPremium = isPremiumUser(response.data?.premiumPackBuyDate, 90);
        setIsEditable(user && user.id === userId);  // Check if user can edit
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    fetchUserData();
  }, [userId, user]);

  // Mock user activity data (should be fetched from backend)
  useEffect(() => {
    // Mock data for the past 2 months activity blocks
    const generateActivityData = () => {
      const today = new Date();
      const lastTwoMonths = Array.from({ length: 60 }, (_, i) => {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        return { date: day.toISOString().split('T')[0], activity: Math.random() > 0.5 }; // Random activity for demonstration
      });
      setActivityData(lastTwoMonths.reverse()); // Show recent activity first
    };
    generateActivityData();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }
  console.log(userData)
  return (
    <div className="container mx-auto p-6">
      {/* Profile Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col items-center space-y-4">
          <img
            src={userData.image || 'https://via.placeholder.com/150'} // Placeholder if no image
            alt="User profile"
            className="w-32 h-32 rounded-full object-cover"
          />
          <h1 className="text-xl font-semibold text-black">{userData.fullName}</h1>
          <p className="text-gray-600">@{userData.username}</p>
          <p className="text-gray-600">{userData.email}</p>
          <p className={`px-4 py-2 rounded-full ${isPremium ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {isPremium ? 'Premium User' : 'Free User'}
          </p>

          {/* Interests and Skills */}
          {userData.interests &&<div className="flex flex-wrap gap-2">
            {userData.interests.map((interest) => (
              <span  className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                {interest}
              </span>
            ))}
          </div>}
          {userData.skills && <div className="flex flex-wrap gap-2 mt-4">
            {userData.skills.map((skill) => (
              <span  className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                {skill}
              </span>
            ))}
          </div>}

          {/* Edit Button (if authorized) */}
          {isEditable && (
            <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* User Activity Section
      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="grid grid-cols-7 gap-2">
          {activityData.map((activity, idx) => (
            <div
              key={idx}
              className={`w-10 h-10 rounded ${activity.activity ? 'bg-green-500' : 'bg-gray-300'}`}
              title={activity.date}
            ></div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default ProfilePage;
