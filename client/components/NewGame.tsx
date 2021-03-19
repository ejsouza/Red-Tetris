import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
// import ModalHeader from 'react-bootstrap/ModalHeader';

const NewGame = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

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
        keyboard={false}
      >
        <Modal.Header closeButton>Enter a room and user name</Modal.Header>
        <Modal.Body>
          I will not close if you click outside me. Don't even try to press
          escape key.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary">Start &#8594;</Button>
        </Modal.Footer>
      </Modal>

      <Button variant="secondary" size="lg" block onClick={() => setShow(true)}>
        New Game
      </Button>
    </>
  );
};

export default NewGame;
