import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { BoxArrowRight, PersonCircle } from 'react-bootstrap-icons';
import { getCurrentUser, logout } from '../core/user';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { userLoggetdUpdated } from '../store/actions';
import { IUser } from '../interfaces';
import { tokenExpired } from '../utils/dates';
import socket from '../utils/socket';

interface IOpenGames {
  name: string;
  players: string[];
}

const NavigationBar = () => {
  const [noOpenGames, setNoOpenGames] = useState(false);
  const [openGames, setOpenGames] = useState(false);
  const [gamesList, setGamesList] = useState<IOpenGames[]>();
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.user);
  const handleCloseNoOpenGames = () => setNoOpenGames(false);
  const handleOpenGames = () => setOpenGames(false);

  const resetUser: IUser = {
    success: false,
    id: '',
    token: '',
  };
  useEffect(() => {
    const currentUser = getCurrentUser() as IUser;
    if (currentUser) {
      if (tokenExpired(currentUser.token)) {
        /**
         * logout() for removing local storage
         */
        logout();
        dispatch(userLoggetdUpdated(resetUser));
      } else {
        dispatch(userLoggetdUpdated(currentUser));
      }
    }
    socket.on('games-open', (games: IOpenGames[]) => {
      if (!games.length) {
        setNoOpenGames(true);
      } else {
        setGamesList(games);
        setOpenGames(true);
      }
    });
  }, []);

  const logOut = () => {
    logout();
    dispatch(userLoggetdUpdated(resetUser));
    router.push('/');
  };

  const searchGame = () => {
    socket.emit('search-games');
  };

  const handleJoinGame = (game: string) => {
    setOpenGames(false);
    socket.emit('createOrJoinGame', game, playerName, true);
    socket.on('join-room', (args: { success: boolean; msg: string }) => {
      if (!args.success) {
        setErrorMsg(args.msg);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 2000);
      } else {
        socket.emit('createRoom', game);
        router.push(`/`, `/#${game}[${playerName}]`);
      }
    });
  };

  useEffect(() => {}, []);
  return (
    <>
      <nav>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/" className="mr-auto">
            <span className="text-danger">Red</span>Tetris
          </Navbar.Brand>
          <Nav className="me-auto">
            {user?.success && (
              <>
                {router.pathname !== '/profile' && (
                  <Nav.Link href="/profile">
                    &nbsp;Profile&nbsp;
                    <PersonCircle size="34px" />
                  </Nav.Link>
                )}
                <Nav.Link onClick={logOut}>
                  &nbsp;Logout&nbsp;
                  <BoxArrowRight size="34px" />
                </Nav.Link>
              </>
            )}
          </Nav>
          &nbsp;
          {router?.pathname === '/' && (
            <Button variant="outline-info" onClick={searchGame}>
              Search
            </Button>
          )}
        </Navbar>
      </nav>
      <Modal
        show={noOpenGames}
        onHide={handleCloseNoOpenGames}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-info">
            There are no open games!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          For the moment there's no game available you can join, however you can
          create yours by clicking on <b>New Game</b>!
        </Modal.Body>
      </Modal>
      {error && (
        <Modal size="sm" show={error} backdrop="static">
          <Modal.Header>
            <Modal.Title id="example-modal-sizes-title-sm">
              <h3 style={{ color: 'red' }}>
                <b>Error</b>
              </h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p style={{ color: 'red' }}>{errorMsg}</p>
          </Modal.Body>
        </Modal>
      )}
      <Modal
        show={openGames}
        aria-labelledby="contained-modal-title-vcenter"
        onHide={handleOpenGames}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Games available to jump in!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
            {gamesList?.map((game) => {
              return (
                <>
                  <Row>
                    <span>Game: </span>
                    <Col xs={8} md={10} key={`game-${game.name}`}>
                      <b>{game.name}</b>
                    </Col>
                    <span>Players in game: </span>
                    {game.players.map((player) => (
                      <Col xs={12} md={3} key={`player-${player}`}>
                        {player}
                      </Col>
                    ))}
                  </Row>
                  <Row>
                    <Col xs={6} md={6} key={`join-game${game.name}`}>
                      <Form.Control
                        type="text"
                        placeholder="Enter name"
                        onChange={(e) => setPlayerName(e.target.value)}
                        isInvalid={
                          playerName.length < 3 ||
                          game.players.includes(playerName)
                            ? true
                            : false
                        }
                      />
                    </Col>
                    <Col xs={6} md={6} key={`button-game${game.name}`}>
                      <Button
                        block
                        variant="secondary"
                        onClick={() => handleJoinGame(game.name)}
                        disabled={
                          playerName.length < 3 ||
                          game.players.includes(playerName)
                            ? true
                            : false
                        }
                      >
                        Join
                      </Button>
                    </Col>
                  </Row>
                  <>
                    <br /> <hr />
                  </>
                </>
              );
            })}
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NavigationBar;
