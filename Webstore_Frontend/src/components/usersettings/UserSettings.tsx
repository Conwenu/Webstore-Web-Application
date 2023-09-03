import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import UserService from "../services/UserService";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useUser } from "../userprovider/UserProvider";
import "./UserSettings.css";
import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";
const UserSettings = () => {
  let userId = UserService.getCurrentUser("id");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [type, setType] = useState("password");
  const [showSymbol, setShowSymbol] = useState(true);

  const handleType = () => {
    if (type == "password") {
      setType("text");
      setShowSymbol(true);
    } else {
      setType("password");
      setShowSymbol(false);
    }
  };

  const changePassButton = () => {
    navi("/changePassword");
  };
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

  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const editFirstName = async () => {
    if (
      window.confirm(
        `Are you sure you want to edit your First Name to "${formData.firstName}"?`
      )
    ) {
      try {
        const response = await axios.put(
          `http://localhost:8080/api/v1/users/editFirstName/${userId}`,
          {
            firstName: formData.firstName,
          }
        );
        toast(response.data, { autoClose: 1000, type: "success" });
        logout();
      } catch (error: any) {
        toast(error.response.data, { autoClose: 1000, type: "error" });
      }
    }
  };

  const editLastName = async () => {
    if (
      window.confirm(
        `Are you sure you want to edit your Last Name to "${formData.lastName}"?`
      )
    ) {
      try {
        const response = await axios.put(
          `http://localhost:8080/api/v1/users/editLastName/${userId}`,
          {
            lastName: formData.lastName,
          }
        );
        toast(response.data, { autoClose: 1000, type: "success" });
        logout();
      } catch (error: any) {
        toast(error.response.data, { autoClose: 1000, type: "error" });
      }
    }
  };

  const editEmail = async () => {
    if (
      window.confirm(
        `Are you sure you want to edit your Email to "${formData.email}"?`
      )
    ) {
      try {
        const response = await axios.put(
          `http://localhost:8080/api/v1/users/editEmail/${userId}`,
          {
            email: formData.email,
          }
        );
        toast(response.data, { autoClose: 4000, type: "success" });
        logout();
      } catch (error: any) {
        toast(error.response.data, { autoClose: 4000, type: "error" });
      }
    }
  };

  const deleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        const response = await axios.delete(
          `http://localhost:8080/api/v1/users/deleteUser/${userId}`
        );
        toast(response.data, { autoClose: 1000, type: "success" });
        logout();
      } catch (error: any) {
        toast(error.message, { autoClose: 1000, type: "error" });
      }
    }
  };

  return (
    <div className="UserSettingsContainer">
      <Form>
        <Row className="align-items-center firstNameRow">
          <Col xs="auto" className="my-1">
            <Form.Label htmlFor="inlineFormInput" visuallyHidden>
              Name
            </Form.Label>
            <InputGroup>
              <Form.Control
                name="firstName"
                minLength={3}
                maxLength={50}
                className="mb-0"
                id="inlineFormInput"
                placeholder="First Name"
                defaultValue={UserService.getCurrentUser("firstName")}
                onChange={(event) => handleChange(event)}
              />

              <InputGroup.Text className="updateInfo">
                <svg
                  onClick={editFirstName}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pencil"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                </svg>
              </InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>

        <Row className="align-items-center lastNameRow">
          <Col xs="auto" className="my-1">
            <Form.Label htmlFor="inlineFormInput" visuallyHidden>
              Name
            </Form.Label>
            <InputGroup>
              <Form.Control
                name="lastName"
                minLength={3}
                maxLength={50}
                className="mb-0"
                id="inlineFormInput"
                placeholder="Last Name"
                defaultValue={UserService.getCurrentUser("lastName")}
                onChange={(event) => handleChange(event)}
              />
              <InputGroup.Text className="updateInfo">
                <svg
                  onClick={editLastName}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pencil"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                </svg>
              </InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>

        <Row className="align-items-center emailRow">
          <Col xs="auto" className="my-1">
            <Form.Label htmlFor="inlineFormInput" visuallyHidden>
              Name
            </Form.Label>
            <InputGroup>
              <Form.Control
                name="email"
                minLength={5}
                maxLength={50}
                className="mb-0"
                id="inlineFormInput"
                placeholder="Email"
                defaultValue={UserService.getCurrentUser("email")}
                onChange={(event) => handleChange(event)}
                type="email"
              />
              <InputGroup.Text className="updateInfo">
                <svg
                  onClick={editEmail}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pencil"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                </svg>
              </InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>

        <Row className="align-items-center passRow">
          <Col xs="auto" className="my-1">
            <Form.Label htmlFor="inlineFormInput" visuallyHidden>
              Name
            </Form.Label>
            <InputGroup>
              <Form.Control
                name="password"
                minLength={8}
                maxLength={50}
                className="mb-0"
                id="inlineFormInput"
                placeholder="Password"
                type={type}
                onChange={(event) => handleChange(event)}
              />
              <InputGroup.Text className="updateInfo">
                {showSymbol ? (
                  <svg
                    onClick={handleType}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-eye"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                  </svg>
                ) : (
                  <svg
                    onClick={handleType}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-eye-slash"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                  </svg>
                )}
              </InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>
        <br />
        <Col xs="auto">
          <Button onClick={changePassButton}>Change Password</Button>
        </Col>
        <br />
        <Col xs="auto">
          <Button
            onClick={deleteAccount}
            className="btn btn-danger mb-2"
            type="button"
          >
            Delete Account
          </Button>
        </Col>
      </Form>
    </div>
  );
};

export default UserSettings;
