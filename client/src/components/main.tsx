import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

export const Main = () => {
  const [newGame, setNewGame] = useState(false);
  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <Button variant="secondary" size="lg" block>
              Login
            </Button>
          </Col>
          <Col>
            <Button variant="secondary" size="lg" block>
              Sign-up
            </Button>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Button
              variant="secondary"
              size="lg"
              block
              onClick={() => setNewGame(true)}
            >
              New Game
            </Button>
            <Modal show={newGame} onHide={() => setNewGame(false)}>
              <p>Testing Modal</p>
            </Modal>
          </Col>
        </Row>
      </Container>
    </>
  );
};
