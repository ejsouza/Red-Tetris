import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { signup } from '../core/user';
import Container from 'react-bootstrap/Container';

const SignUp = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mainTitle, setMainTitle] = useState(true);

  const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  const register = async () => {
    signup(email, password)
      .then((res) => {
        const status = res.status;
        res.json().then((data) => {
          if (status === 400) {
            setError(data.msg);
            setMainTitle(false);
          } else if (status === 201) {
            setShowSignup(false);
            setShowSuccess(true);
            setTimeout(() => {
              setShowSuccess(false);
            }, 4000);
          }
        });
      })
      .catch(() => {
        setError('An error occured, try again later!');
        setMainTitle(false);
      });
  };
  return (
    <>
      <Button
        variant="secondary"
        size="lg"
        block
        onClick={() => setShowSignup(true)}
      >
        Sign-up
      </Button>

      <Container fluid>
        <Modal show={showSuccess} backdrop="static" keyboard={false}>
          <Modal.Header>
            <Modal.Title>
              <span className="text-success">
                Account created successfully!
              </span>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Please check your email inbox and confirm your account.
          </Modal.Body>
        </Modal>
      </Container>
      <Modal
        show={showSignup}
        onHide={() => {
          setShowSignup(false);
          setMainTitle(true);
        }}
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton>
          {mainTitle ? (
            <Modal.Title>
              Join the gang{' '}
              <span className="text-danger font-weight-bold">Red</span>Tetris
            </Modal.Title>
          ) : (
            <Modal.Title>
              <span className="text-danger font-weight-bold">{error}</span>
            </Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                isInvalid={emailRegex.test(email) ? false : true}
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                isInvalid={passRegex.test(password) ? false : true}
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={register}
            block
            disabled={
              !passRegex.test(password) || !emailRegex.test(email)
                ? true
                : false
            }
          >
            Create Account
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SignUp;
