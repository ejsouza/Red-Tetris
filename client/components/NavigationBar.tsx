import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

const NavigationBar = () => {
  return (
    <>
      <nav>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/" className="mr-auto">
            RedTetris
          </Navbar.Brand>
          <Button variant="outline-info">Search</Button>
        </Navbar>
      </nav>
    </>
  );
};

export default NavigationBar;
