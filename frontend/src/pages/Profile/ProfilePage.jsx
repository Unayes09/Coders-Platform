import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../providers/UserProvider";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { isPremiumUser } from "../../utils/dateCalculation";
import { Button, Chip, Spinner } from "@nextui-org/react";
import { db } from "../../firebase/firebase.config";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import MonthlyActivity from "./MonthlyActivity";

const ProfilePage = () => {
  const { user } = useContext(UserContext); // Fetch logged-in user context
  const { userId } = useParams(); // Get userId from route params
  const [userData, setUserData] = useState(null); // State for storing user data
  const [isEditable, setIsEditable] = useState(false); // State to check if the user is authorized to edit
  const [activityData, setActivityData] = useState([]);
  let isPremium = true;

  const activityRef = collection(db, "dailyActivity");

  // Fetch user data from server
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/users/${userId}/profile`
        ); // Fetch user data
        setUserData(response.data);
        isPremium = isPremiumUser(response.data?.premiumPackBuyDate, 90);
        setIsEditable(user && user.id === userId); // Check if user can edit
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    fetchUserData();
  }, [userId, user]);

  useState(() => {
    const fetchEntriesData = async () => {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const q = query(
        activityRef,
        where("userId", "==", user.id),
        where("date", ">=", startOfMonth.toISOString()),
        orderBy("date", "desc")
      );

      const querySnapshot = await getDocs(q);
      const entriesData = querySnapshot.docs.map((doc) => doc.data());

      setActivityData(entriesData);
    };

    if (userId) {
      fetchEntriesData();
    }
  }, [userId]);

  if (!userData) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <Spinner color="white" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Profile Section */}
      <div className="bg-[#30363d54] border border-[#30363db3] shadow-md rounded-lg py-12 px-6 grid grid-cols-3">
        <div className="flex flex-col items-center space-y-4">
          <img
            src={userData.image || "https://via.placeholder.com/150"} // Placeholder if no image
            alt="User profile"
            className="w-32 h-32 rounded-full object-cover"
          />
          <div className="flex flex-col gap-1 items-center justify-center">
            <h1 className="text-xl font-semibold">{userData.fullName}</h1>
            <p className="text-primary">@{userData.username}</p>
            <p className="text-gray-600">{userData.email}</p>
          </div>
          <p className={`px-4 py-2`}>
            {isPremium ? (
              <Chip color="success" variant="shadow">
                Premium User
              </Chip>
            ) : (
              <Chip color="success" variant="light">
                Free User
              </Chip>
            )}
          </p>

          {/* Interests and Skills */}
          {userData.interests && (
            <div className="flex flex-wrap gap-2">
              <span>Interests: </span>
              {userData.interests.map((interest) => (
                <Chip key={interest} size="sm" color="secondary">
                  {interest}
                </Chip>
              ))}
            </div>
          )}
          {userData.skills && (
            <div className="flex flex-wrap gap-2">
              <span>Skills: </span>
              {userData.skills.map((skill) => (
                <Chip key={skill} size="sm" color="primary">
                  {skill}
                </Chip>
              ))}
            </div>
          )}

          {/* Edit Button (if authorized) */}
          {isEditable && <Button variant="flat">Edit Profile</Button>}
        </div>
        <div className="col-span-2 border-l border-[#30363db3] pl-14">
          <h1 className="text-xl text-primary font-semibold tracking-wide mb-5">
            Monthly Activity
          </h1>
          <MonthlyActivity activityData={activityData} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
