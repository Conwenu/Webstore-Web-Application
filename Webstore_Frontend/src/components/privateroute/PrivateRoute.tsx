import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../userprovider/UserProvider";
import Spinner from "react-bootstrap/Spinner";
import { LogoutFunction } from "../user/logout/LogoutFunction";
import axios from "axios";

export const PrivateRoute = ({ children }: any) => {
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [valid, setIsValid] = useState<any>();

  useEffect(() => {
    console.log(valid);
  }, [user, isLoading]);

  if (user && user.jwt) {
    axios
      .get(`http://localhost:8080/api/auth/validate?token=${user.jwt}`, user)
      .then((isValid) => {
        if (isValid) {
          setIsValid(isValid.data);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    return <Navigate to="/login" />;
  }
  return isLoading ? (
    <div>
      {" "}
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  ) : valid == true ? (
    children
  ) : (
    <>
      <LogoutFunction />
    </>
  );
};
