import axios from "axios";
import Form from "react-bootstrap/Form";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import { InputGroup } from "react-bootstrap";
import { useUser } from "../../userprovider/UserProvider";
import "./Login.css";
export const Login = () => {
  const user = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  let navigate = useNavigate();
  const logout = () => {
    const cookies = new Cookies();
    localStorage.setItem("user", "");
    cookies.set("jwt_authorization", "", { path: "/" } as any);
    <Navigate to="/login" />;
    axios.get("http://localhost:8080/api/auth/logout").then((response) => {
      if (response.status === 200) {
        user.setJwt("null");
        <Navigate to="/login" />;
        navigate("/login");
      }
    });
  };
  const [type, setType] = useState("password");
  const [showSymbol, setShowSymbol] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleType = () => {
    if (type == "password") {
      setType("text");
      setShowSymbol(true);
    } else {
      setType("password");
      setShowSymbol(false);
    }
  };
  useEffect(() => {
    if (user.jwt !== "null" && user.jwt !== undefined && user.jwt !== "") {
      console.log(user.jwt);
      navigate("/products");
    } else {
      logout();
    }
    console.log(user);
  }, [user]);

  const handlePasswordReset = async () => {
    axios
      .post("http://localhost:8080/api/v1/password-reset-request", {
        email: tempEmail,
      })

      .then((response) => {
        setTempEmail("");
        if (response.status === 200) {
          toast("Please Check Your Email For Further Instructions", {
            autoClose: 2500,
            type: "success",
          });
          // let token = response.data.substring(50);
          // navigate(`/forgotPassReset/${token}`);
        }
      })
      .catch((error) => {
        toast(error.response.data, {
          autoClose: 5000,
          type: "error",
        });
      });
    handleClose();
  };

  const handleLoginRequest = async (event: any) => {
    setErrorMsg("");
    event.preventDefault();
    event.persist();
    axios
      .post("http://localhost:8080/api/auth/login", {
        email: email,
        password: password,
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.status === 200) {
          setErrorMsg("");
          user.setJwt(response.data.accessToken);
          localStorage.setItem("user", JSON.stringify(response.data));
          toast("Successful Login Attempt", {
            autoClose: 1000,
            type: "success",
          });
          return response.statusText;
        }
      })
      .then(() => {
        navigate("/products");
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            toast(error.response.data, { autoClose: 5000, type: "error" });
          }
          if (
            error.response.data ===
            "This Account Is Not Enabled, Please check your email to enable your account"
          ) {
            // axios.get(`http://localhost8080/api/v1/resend-verification-token?token=`)
          }
        } else {
          setErrorMsg("SERVER DOWN. PLEASE TRY AGAIN LATER!");
          toast(error, { autoClose: 1000, type: "error" });
        }
      });
  };
  return (
    <>
      <div className="loginContainer">
        <h1 className="LoginText">Login</h1>
        <Form onSubmit={handleLoginRequest}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label style={{ color: "antiquewhite " }}>
              Email address
            </Form.Label>
            <FloatingLabel
              className="FloatingInput"
              controlId="Floating-Input"
              label="Email Address"
            >
              {" "}
              <Form.Control
                className="fill-in"
                required
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="name@example.com"
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label style={{ color: "antiquewhite " }}>Password</Form.Label>
            <InputGroup>
              <Form.Control
                className="fill-in"
                type={type}
                required
                placeholder="Enter Password"
                onChange={(event) => setPassword(event.target.value)}
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
          <Button variant="secondary" className="login-btn" type="submit">
            Login
          </Button>
        </Form>
        <br />
        {errorMsg ? (
          <div className="justify-content-center mb-4">
            <div>
              <div className="" style={{ color: "red", fontWeight: "bold" }}>
                {errorMsg}
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div>
          <a
            style={{
              textDecoration: "underline",
              color: "Beige",
              cursor: "pointer",
            }}
            onClick={handleShow}
          >
            Forgot Password?
          </a>
        </div>
        <div>
          Don't Have An Account? <a href="/register">Sign Up</a>
        </div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Reset Password Form</Modal.Title>
          </Modal.Header>
          <Modal.Body>Please Provide Your Email Address</Modal.Body>
          <Modal.Body>
            {" "}
            <Form.Control
              className="fill-in"
              required
              onChange={(event) => setTempEmail(event.target.value)}
              defaultValue={""}
              type="tempEmail"
              placeholder="name@example.com"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handlePasswordReset}>
              Send
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};
