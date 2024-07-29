import { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [refetchUser, setRefetchUser] = useState(false);

  useEffect(() => {
    setIsUserLoading(true);

    console.log("user refreshed");

    const token = JSON.parse(localStorage.getItem("token"));

    if (!token) {
      localStorage.removeItem("token");
      localStorage.removeItem("profile");

      setUser(null);
      setIsUserLoading(false);
    } else {
      axiosInstance
        .get(`/api/users/profile?token=${token}`)
        .then((res) => {
          const profileObject = res.data;
          profileObject.token = token;

          setUser(profileObject);
          setIsUserLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setUser(null);
          setIsUserLoading(false);
        });
    }
  }, [refetchUser]);

  const refreshUser = () => {
    setRefetchUser(!refetchUser);
  };

  return (
    <UserContext.Provider value={{ isUserLoading, user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
