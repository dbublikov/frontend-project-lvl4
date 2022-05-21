import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/index.js';

const AuthSection = () => {
  const auth = useAuth();
  const getUsername = () => JSON.parse(localStorage.getItem('userId')).username;

  const renderSection = () => {
    if (auth.loggedIn) {
      return (
        <>
          <Navbar.Text>
            <b>{getUsername()}</b>
            &nbsp; |
          </Navbar.Text>
          <Nav.Link onClick={auth.logOut}>Log Out</Nav.Link>
        </>
      );
    }

    return <Button as={Link} to="/login">Log In</Button>;
  };

  return (
    <Navbar.Collapse>
      {renderSection()}
    </Navbar.Collapse>
  );
};

const AppNavbar = () => (
  <Navbar className="mb-3" bg="light">
    <Link to="/" className="mr-auto navbar-brand">Home</Link>
    <Nav>
      <AuthSection />
    </Nav>
  </Navbar>
);

export default AppNavbar;
