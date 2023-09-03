import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useEffect } from "react";
import { toast } from "react-toastify";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../userprovider/UserProvider";
export const LogoutFunction = () => {
  useEffect(() => {
    toast("You have been logged out due to your session token expiring...", {
      autoClose: 1000,
      type: "error",
    });
    logout();
  });

  const User = useUser();
  const navi = useNavigate();
  const logout = () => {
    const cookies = new Cookies();
    localStorage.setItem("user", "");
    cookies.set("jwt_authorization", "", { path: "/" } as any);
    <Navigate to="/login" />;
    axios.get("http://localhost:8080/api/auth/logout").then((response) => {
      if (response.status === 200) {
        User.setJwt("null");
        <Navigate to="/login" />;
        navi("/login");
      }
    });
  };

  return (
    <>
      <div></div>
    </>
  );
};
