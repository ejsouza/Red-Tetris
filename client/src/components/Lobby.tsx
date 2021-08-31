import React from 'react';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Loading from './Loading';

const Lobby = (): JSX.Element => {
  return (
    <>
      <Container>
        <Row>
          <Col>
            <p>Waiting for host to start game</p>
          </Col>
        </Row>
        <Row>
          <Loading />
        </Row>
      </Container>
    </>
  );
};

export default connect()(Lobby);
