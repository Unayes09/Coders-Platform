export const getUser = () => {
  const token = localStorage.getItem("token");
  const profile = localStorage.getItem("profile");

  if (!token || !profile) {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    return null;
  }

  const profileObject = JSON.parse(profile);
  profileObject.token = JSON.parse(token);

  return profileObject;
};
