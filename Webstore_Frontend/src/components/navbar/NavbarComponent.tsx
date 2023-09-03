import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import UserService from "../services/UserService";
import { useUser } from "../userprovider/UserProvider";
import { LogoutComponent } from "../user/logout/Logout";
import "../navbar/NavbarComponent.css";
function NavbarComponent() {
  const user = useUser();
  const navigate = useNavigate();

  const sendToCart = () => {
    navigate(`profile/${UserService.getCurrentUser("id")}`);
  };
  return (
    <Navbar
      fixed="top"
      bg="dark"
      data-bs-theme="dark"
      className="bg-body-tertiary navbar"
    >
      <Container>
        <Navbar.Brand href="/products">Home</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse role={"Navbar"} className="justify-content-end">
          <Navbar.Text>
            {user &&
            user.jwt &&
            user.jwt !== "null" &&
            user.jwt !== undefined &&
            user.jwt.length > 1 ? (
              <div>
                Signed in as:
                <div
                  className="FullNameContainer"
                  onClick={sendToCart}
                  style={{ cursor: "pointer" }}
                >
                  {UserService.getCurrentUser("firstName") +
                    " " +
                    UserService.getCurrentUser("lastName")}
                </div>
              </div>
            ) : (
              <div>
                {" "}
                <a href="/login">Sign In</a> / <a href="/register">Register</a>
              </div>
            )}
          </Navbar.Text>
        </Navbar.Collapse>
        <Navbar.Collapse role={"Navbar"} className="justify-content-end">
          <Navbar.Text>
            <LogoutComponent />
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
