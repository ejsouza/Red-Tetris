import { useState } from 'react';
import { useRouter } from 'next/router';
import Form from 'react-bootstrap/Form';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { createNewToken } from '../../src/core/user';

const Index = () => {
  const [email, setEmail] = useState('');
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState('');
  const [action, setAction] = useState('Play');
  const [msgClass, setMsgClass] = useState('text-success');
  const router = useRouter();

  const handleClose = () => setShow(false);
  const redirect = () => {
    router?.push('/');
  };

  const handlesubmit = () => {
    createNewToken(email).then((res) => {
      const status = res.status;
      res.json().then((data) => {
        setMsg(data.msg);
        setShow(true);
        if (status === 401) {
          setMsgClass('text-danger');
          setAction('Sign-up');
        } else if (status === 200) {
          setMsgClass('text-info');
        }
      });
    });
  };
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Verify Account</Modal.Title>
        </Modal.Header>
        <Modal.Body className={msgClass}>{msg}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={redirect}>
            {action}
          </Button>
        </Modal.Footer>
      </Modal>
      <Jumbotron>
        <h1>Token expired</h1>
        <p>
          Your token has expired,{' '}
          <span className="text-info">don't panic!</span>
        </p>
        <p>
          Fill the form bellow with the same address you used to create your
          account
        </p>
        <p>and we will send you a new token for activating your account.</p>
      </Jumbotron>
      <Container fluid>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>
          <Button variant="secondary" onClick={handlesubmit} block>
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default Index;
