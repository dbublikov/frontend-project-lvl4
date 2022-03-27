import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AppNavbar() {
  return (
    <Navbar bg="light" expand="lg">
      <Link to="/" className="mr-auto navbar-brand">Home</Link>
      <Nav>
        <Link to="/login" className="nav-link">Sign in</Link>
      </Nav>
    </Navbar>
  );
}

export default AppNavbar;
