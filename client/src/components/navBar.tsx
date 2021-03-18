import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

export const NBar = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home" className="mr-auto">
          RedTetris
        </Navbar.Brand>
        <Nav>
          {/* <Nav.Link href="#login">Login</Nav.Link>
          <Nav.Link href="#login">Sign-up</Nav.Link> */}
          <Button variant="outline-info">Search Room</Button>
        </Nav>
      </Navbar>
    </>
  );
};
