import React from "react";
import { Navigate } from "react-router";
import { TOKEN } from "../../constants/keys";
import { getLocalStorage } from "../../utils/storage";
import LoginPage from "../../pages/login_page";
const PrivateRoutes = ({ children }) => {
  let token = getLocalStorage(TOKEN);
  return token ? <Navigate to="/candidate/" /> : <LoginPage />;
};
export default PrivateRoutes;
