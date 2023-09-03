import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useUser } from "../../userprovider/UserProvider";
export const LogoutComponent = () => {
  const User = useUser();
  const navi = useNavigate();
  const logout = () => {
    const cookies = new Cookies();
    localStorage.setItem("user", "");
    localStorage.setItem("user", "");
    cookies.set("jwt_authorization", "", { path: "/" } as any);
    axios.get("http://localhost:8080/api/auth/logout").then((response) => {
      if (response.status === 200) {
        User.setJwt("null");
        <Navigate to="/login" />;
        navi("/login");
      }
    });
  };

  return (
    <div>
      {User && User.jwt ? (
        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      ) : (
        <Navigate to="/login" />
      )}
    </div>
  );
};
