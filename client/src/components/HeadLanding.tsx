import React from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';

const HeadLanding = () => {
  return (
    <>
      <Jumbotron fluid>
        <Container fluid>
          <h1 className="text-center">
            Welcome to <span className="bg-danger text-white">Red</span>Tetris
          </h1>
        </Container>
      </Jumbotron>
    </>
  );
};

export default HeadLanding;
