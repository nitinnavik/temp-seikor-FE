import axios from "axios";
import { getLocalStorage, setLocalStorage } from "../utils/storage";
import { TOKEN, USER_ID } from "../constants/keys";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router";
import toaster from "./../utils/toaster";
import { SESSION_EXPIRED_MESSAGE } from "./../constants/message";

// const getNavigate = (url) => {
//   const navigate = useNavigate();
//   navigate(url);
// };
const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  timeout: 1000 * 10, // Wait for 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: (status) => {
    return true;
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = getLocalStorage(TOKEN);
    if (token) {
      config.headers["Authorization"] = "Bearer " + token; // for Spring Boot back-end
      //   config.headers["x-access-token"] = token; // for Node.js Express back-end
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    const userId = getLocalStorage(USER_ID);
    if (res?.status === 401) {
      if (
        window.location.pathname == "/candidate/all-jobs" ||
        window.location.pathname == "/candidate/recommended-jobs"
      ) {
        return;
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        toaster("error", SESSION_EXPIRED_MESSAGE);
        setTimeout(() => {
          window.location.replace("/login");
        }, 500);
      }
    } else if (res?.headers?.token && userId) {
      setLocalStorage(TOKEN, res?.headers?.token);
    }
    return res;
  },
  async (err) => {}
);

export default instance;
