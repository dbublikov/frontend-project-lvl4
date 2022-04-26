import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/index.js';

function AuthButton() {
  const auth = useAuth();

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>Log Out</Button>
      : <Button as={Link} to="/login">Log In</Button>
  );
}

function AppNavbar() {
  return (
    <Navbar bg="light" expand="lg">
      <Link to="/" className="mr-auto navbar-brand">Home</Link>
      <Nav>
        <AuthButton />
      </Nav>
    </Navbar>
  );
}

export default AppNavbar;
