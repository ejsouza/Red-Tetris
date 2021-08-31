import { useState } from 'react';
import socket from '../utils/socket';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Image from 'next/image';
import WaitHostButton from './WaitHostButton';
import { IProps } from './LostGame';
import { useAppSelector } from '../store/hooks';

const GameWinner = (props: IProps): JSX.Element => {
  const [show, setShow] = useState(true);
  const isHost = useAppSelector((state) => state.isHost);
  const handleClose = () => setShow(false);

  const handleQuit = () => {
    setShow(false);
    socket.emit('player-quit', props.game, props.player);
  };

  const handleRestart = () => {
    setShow(false);
    socket.emit('restart-game', props.game, props.player);
  };
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Modal.Title>
            <Image
              src={'/winner.png'}
              alt="winner"
              width="64px"
              height="64px"
            />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>You win! 🎉 🎉</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={handleQuit}>
            Quit ❌
          </Button>
          {isHost ? (
            <Button variant="outline-secondary" onClick={handleRestart}>
              Play again
            </Button>
          ) : (
            <WaitHostButton msg="Waiting host..." />
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GameWinner;
