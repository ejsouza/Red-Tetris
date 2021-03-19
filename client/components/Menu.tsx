import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NewGame from './NewGame';

const Menu = () => {
  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <Button variant="secondary" size="lg" block>
              Sigin
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
            <NewGame />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Menu;
