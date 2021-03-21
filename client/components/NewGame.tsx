import React, { useState } from 'react';
import {useRouter} from 'next/router';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

// import ModalHeader from 'react-bootstrap/ModalHeader';

const NewGame = () => {
  const [show, setShow] = useState<boolean>(false);
  const [roomName, setRoomName] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const router = useRouter();
	
	const handleClose = (): void => {
    setRoomName('');
    setUserName('');
    setShow(false);
  };

  const handSubmit = (): void => {
    console.log(roomName);
    // setRoomName('');
    // setUserName('');
    setShow(false);
		// if all goes well redirect user to localhost:300/#<roomName>[<userName>]
		router.push(`/`, `/#${roomName}[${userName}]`);
  };
  return (
    <>
      <Modal
        show={show}
        size="lg"
        // Create class modal-90h and define height
        // dialogClassName="modal-90h"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <h3 className="font-weight-light">
            Enter a <span className="font-weight-normal">room</span> and{" "}
            <span className="font-weight-normal">user</span>{" "}name
          </h3>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="roomName">
              <Form.Label>Room</Form.Label>
              <Form.Control
                type="text"
                isValid={roomName.length >= 4 ? true : false}
                isInvalid={roomName.length < 4 ? true : false}
                placeholder="Enter room"
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                  setRoomName(event.target.value)
                }
              />
              <Form.Text className="text-muted">
                Room should not be already in use and at least four characters
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="userName">
              <Form.Label>User</Form.Label>
              <Form.Control
                type="text"
                isValid={userName.length >= 4 ? true : false}
                isInvalid={userName.length < 4 ? true : false}
                placeholder="Enter user name"
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                  setUserName(event.target.value)
                }
              />
              <Form.Text className="text-muted">
                User name should be at least four characters long
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handSubmit}
            disabled={roomName.length < 4 || userName.length < 4 ? true : false}
          >
            Start &#8594;
          </Button>
        </Modal.Footer>
      </Modal>

      <Button variant="secondary" size="lg" block onClick={() => setShow(true)}>
        New Game
      </Button>
    </>
  );
};

export default NewGame;

