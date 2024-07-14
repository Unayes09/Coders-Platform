export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("profile");
};
