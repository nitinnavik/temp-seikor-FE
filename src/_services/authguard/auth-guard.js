import { useEffect, useState } from "react";
import { Outlet, Navigate, useNavigate } from "react-router";
import { createSearchParams } from "react-router-dom";
import { TOKEN } from "../../constants/keys";
import { getLocalStorage } from "../../utils/storage";

const AuthGuard = () => {
  let token = getLocalStorage(TOKEN);
  const [windowUrl, setWindowUrl] = useState(window?.location?.href);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      return;
    } else {
      console.log(window.location);
      navigate({
        pathname: "login",
        // search: `${windowUrl}`,
        search: createSearchParams({
          redirectTo: `${windowUrl}`,
        })?.toString(),
      });
    }
  }, [token]);
  return token ? <Outlet /> : <Navigate to={windowUrl} />;
};

export default AuthGuard;
