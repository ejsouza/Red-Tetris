import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';
import ListGroup from 'react-bootstrap/ListGroup';
import Loading from '../components/Loading';
import { Gear } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';
import NavigationBar from '../components/NavigationBar';
import { getUserById, updateProfile, getCurrentUser } from '../core/user';

const CenterProfilePicture = styled.div``;

interface IUser {
  firstName: string;
  lastName: string;
  bestLevel: number;
  bestScore: number;
  playedGames: number;
  createdAt: Date;
  updatedAt: Date;
  victory: number;
  defeat: number;
}

const Profile = () => {
  const [user, setUser] = useState<IUser>();
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('Update Profile');
  const [dangerClass, setDangerClass] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    updateProfile(firstName, lastName).then((res) => {
      const status = res.status;

      res.json().then((data) => {
        if (status === 201) {
          setUser(data.user);
          handleClose();
        } else {
          setTitle(data.msg);
          setDangerClass('text-danger');
        }
      });
    });
  };

  const handleClose = () => {
    setShow(false);
    setFirstName('');
    setLastName('');
    setDangerClass('');
  };

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/');
    }
    getUserById().then((res) => {
      const status = res.status;
      if (status === 404) {
        router.push('/');
      } else {
        res.json().then((data) => {
          console.log(data);
          setUser(data.user);
        });
      }
    });
  }, []);
  return !user ? (
    <Loading />
  ) : (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className={dangerClass}>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label>First name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your first name"
                isInvalid={firstName.length < 3 ? true : false}
                isValid={firstName.length > 2 ? true : false}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your last name"
                isInvalid={lastName.length < 3 ? true : false}
                isValid={lastName.length > 2 ? true : false}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={handleSubmit}
            disabled={
              firstName.length < 3 || lastName.length < 3 ? true : false
            }
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      <NavigationBar />
      <Card className="text-center">
        <CenterProfilePicture>
          <Image
            src="/pic.jpeg"
            alt="Profile picture"
            roundedCircle
            width="171px"
            height="180px"
          />
        </CenterProfilePicture>
        <Card.Header>Profile</Card.Header>
        <Card.Body>
          <Card.Title>
            {user.firstName.length > 0 && (
              <span className="lead">Welcome&nbsp;</span>
            )}
            {user.firstName}&nbsp;{user.lastName}
            {!user.firstName && <span className="lead">Update your name</span>}
            &nbsp;
            <Gear size="18px" onClick={() => setShow(true)} color="#0dcaf0" />
          </Card.Title>
          <Card.Text>
            Hello<b>&nbsp;{user?.firstName}&nbsp;</b>
            this is your private space
            <br />
            here you can check your records and update your info
          </Card.Text>
          <ListGroup className="list-group-flush">
            <ListGroup.Item />
            <ListGroup.Item>Games Played {user.playedGames}</ListGroup.Item>
            <ListGroup.Item>Higher Score {user.bestScore}</ListGroup.Item>
            <ListGroup.Item>Higher Level {user.bestLevel}</ListGroup.Item>

            <ListGroup.Item>Victories {user.victory}</ListGroup.Item>
            <ListGroup.Item>Defeats {user.defeat}</ListGroup.Item>
          </ListGroup>
        </Card.Body>
        {user.updatedAt && (
          <Card.Footer className="text-muted">
            Last connection&nbsp;
            {new Date(user.updatedAt).toISOString().slice(0, 10)}
          </Card.Footer>
        )}
      </Card>
    </>
  );
};

export default Profile;
