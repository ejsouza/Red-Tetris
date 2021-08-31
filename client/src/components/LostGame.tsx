import { useEffect, useState } from 'react';
import socket from '../utils/socket';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Image from 'next/image';
import WaitHostButton from './WaitHostButton';
import { useAppSelector } from '../store/hooks';

export interface IProps {
  player: string;
  game: string;
  gameOver: boolean;
}

const LostGame = (props: IProps): JSX.Element => {
  const [show, setShow] = useState(true);
  const [gameOver, setGameOver] = useState(false);
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

  useEffect(() => {
    setGameOver(props.gameOver);
  }, []);

  useEffect(() => {
    socket.on('game-is-over', () => {
      setGameOver(true);
    });
  }, []);

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
              src={'/game-over.png'}
              alt="game-over"
              width="64px"
              height="64px"
            />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>You lose! 😩 ⚰️</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={handleQuit}>
            Quit ❌
          </Button>
          {isHost && gameOver ? (
            <Button variant="outline-secondary" onClick={handleRestart}>
              Play again
            </Button>
          ) : isHost && !gameOver ? (
            <WaitHostButton msg="Waiting game to finish..." />
          ) : (
            <WaitHostButton msg="Waiting host..." />
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LostGame;
