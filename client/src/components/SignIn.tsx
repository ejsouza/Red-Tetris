import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { signin, changePassword } from '../core/user';
import { IUser } from '../interfaces';
import { useAppDispatch } from '../store/hooks';
import { userLoggetdUpdated } from '../store/actions';
import { PASS_REGEX, EMAIL_REGEX } from '../utils/const';

const SignIn = () => {
  const [show, setShow] = useState(false);
  const [showForgottenPassword, setShowForgottenPassword] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);
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

  const handleCloseForgotten = () => {
    setShowForgottenPassword(false);
  };

  const resetPassord = () => {
    changePassword(email, password);
    setShowForgottenPassword(false);
    setShowEmailSent(true);
    setTimeout(() => {
      setShowEmailSent(false);
    }, 4000);
  };

  const handleSignIn = async () => {
    const user = await signin(email, password);
    if (user) {
      if (user.status === 200) {
        const data = (await user.json()) as IUser;
        localStorage.setItem('user', JSON.stringify(data));
        dispatch(userLoggetdUpdated(data));
      } else {
        const data = await user.json();
        setClassTitle('text-danger');
        setTitle(data.err);
      }
    }
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
          <Button
            variant="outline-secondary"
            block
            onClick={() => {
              setShow(false);
              setShowForgottenPassword(true);
            }}
          >
            Forgotten your password ?
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showForgottenPassword}
        onHide={handleCloseForgotten}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Forgot password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Please enter the <b>email</b> linked to your account, and a{' '}
            <b>new password</b>, we will reset your password and send a
            confirmation link to your inbox. Make sure to check it as soon as
            possible, the link will expire within one hour.
          </p>
          <hr />
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
              <Form.Group controlId="formBasicPassword">
                <Form.Label>New password</Form.Label>
                <Form.Control
                  isInvalid={PASS_REGEX.test(password) ? false : true}
                  type="password"
                  placeholder="Enter a new password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={resetPassord}
            block
            disabled={
              !PASS_REGEX.test(password) || !EMAIL_REGEX.test(email)
                ? true
                : false
            }
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEmailSent} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Reset password request sent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please check your<b>&nbsp;email&nbsp;</b>
          box, we sent you a link for reseting your password. This link will
          expire within one hour.
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SignIn;
