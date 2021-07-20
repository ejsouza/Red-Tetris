import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
      console.log('games-open ', games.length);
      if (!games.length) {
        setNoOpenGames(true);
      } else {
        setGamesList(games);
        setOpenGames(true);
        games.forEach((game) => {
          console.log(`gameName := ${game.name}`);
          game.players.forEach((player) => console.log(`palyerName ${player}`));
        });
      }
    });
  }, []);

  const logOut = () => {
    logout();
    dispatch(userLoggetdUpdated(resetUser));
    router.push('/');
  };

  const searchGame = () => {
    console.log(`go search for games`);
    socket.emit('search-games');
  };
  return (
    <>
      <nav>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/" className="mr-auto">
            <span className="text-danger">Red</span>Tetris
          </Navbar.Brand>
          <Nav className="me-auto">
            {user.success && (
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
          {router.pathname === '/' && (
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
            Using Grid in Modal
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
            {gamesList?.map((game) => {
              return (
                <Row>
                  <Col xs={12} md={12}>
                    {game.name}
                  </Col>
                  {game.players.map((player) => (
                    <Col xs={4} md={4}>
                      {player}
                    </Col>
                  ))}
                </Row>
              );
            })}
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NavigationBar;
