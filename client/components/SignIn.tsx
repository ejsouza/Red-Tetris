import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { signin } from '../core/user';
import { IUser } from '../interfaces';
import { useAppDispatch } from '../store/hooks';
import { userLoggetdUpdated } from '../store/actions';
import { PASS_REGEX, EMAIL_REGEX } from '../utils/const';

const SignIn = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('Log-in');
  const [classTitle, setClassTitle] = useState('');
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setClassTitle('');
    setTitle('Log-in');
    setShow(false);
  };

  const handleSignIn = () => {
    signin(email, password).then((logged) => {
      const status = logged.status;
      logged.json().then((data) => {
        if (status === 200) {
          const user = data as IUser;
          if (user.token) {
            localStorage.setItem('user', JSON.stringify(user));
            dispatch(userLoggetdUpdated(user));
          }
          setEmail('');
          setPassword('');
          setShow(false);
        } else {
          setClassTitle('text-danger');
          setTitle(data.err);
        }
      });
    });
  };

  return (
    <>
      <Button variant="secondary" size="lg" block onClick={() => setShow(true)}>
        Sign-in
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span className={classTitle}>{title}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                isInvalid={EMAIL_REGEX.test(email) ? false : true}
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
                isInvalid={PASS_REGEX.test(password) ? false : true}
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
            onClick={handleSignIn}
            block
            disabled={
              !PASS_REGEX.test(password) || !EMAIL_REGEX.test(email)
                ? true
                : false
            }
          >
            Login
          </Button>
          <Button variant="outline-secondary" block>
            Forgotten your password ?
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SignIn;
