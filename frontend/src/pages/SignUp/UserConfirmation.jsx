import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const UserConfirmation = () => {
   // Extract the token from the URL
  const query = useQuery();
  const token = query.get("token"); // Get the 'token' query parameter
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true); // For loading state
  const navigate = useNavigate(); // React Router's useNavigate hook for navigation
  //console.log(token)
  useEffect(() => {
    // API call to confirm the user
    const confirmUser = async () => {
      try {
        const response = await axiosInstance.get(`/api/users/confirm/${token}`);
        setStatusMessage(response.data.message)
      } catch (error) {
        setStatusMessage("There was an error with your token.");
      } finally {
        setIsLoading(false); // Stop loading after API response
      }
    };

    confirmUser();
  }, [token]);

  // Handle "Go to Login" button click
  const goToLogin = () => {
    navigate("/login"); // Navigate to the login page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {isLoading ? (
        <div className="text-xl text-gray-700">Confirming your ID...</div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-center text-purple-700">
            {statusMessage}
          </h1>
          {statusMessage.includes("successfully confirmed") && (
            <p className="mt-4 text-center text-gray-600">
              Welcome to Coders Platform!
            </p>
          )}
          {statusMessage.includes("error") && (
            <p className="mt-4 text-center text-red-500">
              Please contact support for further assistance.
            </p>
          )}
          {/* Go to Login button */}
          <button
            onClick={goToLogin}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default UserConfirmation;
