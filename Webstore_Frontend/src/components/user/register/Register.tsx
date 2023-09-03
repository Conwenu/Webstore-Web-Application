import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { InputGroup } from "react-bootstrap";
import { Button } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { toast } from "react-toastify";

import "./Register.css";
export const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  let navigate = useNavigate();
  const [type, setType] = useState("password");
  const [showSymbol, setShowSymbol] = useState(false);

  const handleType = () => {
    if (type == "password") {
      setType("text");
      setShowSymbol(true);
    } else {
      setType("password");
      setShowSymbol(false);
    }
  };

  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSignUp = async (event: any) => {
    event.preventDefault();
    event.persist();
    axios
      .post("http://localhost:8080/api/v1/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: "USER",
      })
      .then((response) => {
        if (response.status === 200) {
          toast(
            "Successful Registration, Please Check your email to validate your account.",
            { autoClose: 2500, type: "success" }
          );
        }
      })
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status == 400) {
            toast(error.response.data, { autoClose: 3000, type: "error" });
          }
        } else {
          toast(
            "Something went wrong, please recheck to ensure that all fields are properly filled, or try again later.",
            { autoClose: 3000, type: "error" }
          );
        }
      });
  };

  return (
    <Form onSubmit={handleSignUp}>
      <div className="registerContainer">
        <h1 style={{ color: "antiquewhite " }}>Register </h1>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label style={{ color: "antiquewhite " }}>First Name</Form.Label>{" "}
          <FloatingLabel label="First Name">
            {" "}
            <Form.Control
              required
              minLength={3}
              maxLength={50}
              name="firstName"
              className="fill-in"
              type="text"
              placeholder="Ren"
              onChange={(event) => handleChange(event)}
            />
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label style={{ color: "antiquewhite " }}>Last Name</Form.Label>{" "}
          <FloatingLabel label="Last Name">
            <Form.Control
              required
              minLength={3}
              maxLength={50}
              name="lastName"
              className="fill-in"
              type="text"
              placeholder="Goku"
              onChange={(event) => handleChange(event)}
            />
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label style={{ color: "antiquewhite " }}>
            Email Address
          </Form.Label>
          <FloatingLabel label="Email Address">
            {" "}
            <Form.Control
              required
              className="fill-in"
              name="email"
              minLength={5}
              onChange={(event) => handleChange(event)}
              type="email"
              placeholder="name@example.com"
            />
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label style={{ color: "antiquewhite " }}>Password</Form.Label>
          <InputGroup>
            <Form.Control
              required
              className="fill-in"
              minLength={8}
              name="password"
              type={type}
              placeholder="Enter Password"
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
        </Form.Group>
      </div>
      <Button variant="secondary" className="register-btn" type="submit">
        Sign Up
      </Button>
      <div>
        Already Have An Account? <a href="/login">Sign In</a>
      </div>
    </Form>
  );
};
