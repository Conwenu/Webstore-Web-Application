import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
function NonAuthNavbarComponent() {
  return (
    <Navbar
      fixed="top"
      bg="dark"
      data-bs-theme="dark"
      className="bg-body-tertiary"
    >
      <Container>
        <Navbar.Brand href="#home">Home</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <p>
              <a href="/login">Sign In</a> / <a href="/register">Register</a>
            </p>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NonAuthNavbarComponent;
