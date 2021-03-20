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
          <Col xs={12} md={6} className="mt-4">
            <Button variant="secondary" size="lg" block>
              Sigin
            </Button>
          </Col>

          <Col xs={12} md={6} className="mt-4">
            <Button variant="secondary" size="lg" block>
              Sign-up
            </Button>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <NewGame />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Menu;
