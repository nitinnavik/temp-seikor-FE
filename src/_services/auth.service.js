import { LOGIN_ENDPOINT } from "../constants/api-endpoints";
import { TOKEN } from "../constants/keys";
import { clearLocalStorage, setLocalStorage } from "../utils/storage";
import api from "./api";

const login = (username, password) => {
  return api
    .post(LOGIN_ENDPOINT, {
      username,
      password,
    })
    .then((response) => {
      // console.log(response.data.accessToken);
      // localStorage.setItem("token", response.data.accessToken);
      setLocalStorage(TOKEN, response?.data?.data?.accessToken);
      localStorage.setItem("userId", response?.data?.data?.id);
      console.log(response);
      return response;
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response);
      }
      console.log(err);
      return err;
    });
};

const logout = () => {
  clearLocalStorage();
};

export { login, logout };
