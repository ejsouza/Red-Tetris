import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Loading from './Loading';
import { getGameByName } from '../core/games';
import socket from '../utils/socket';

interface IStartProps {
  gameName: string;
  playerName?: string;
}

interface IGame {
  name: string;
  open: boolean;
  over: boolean;
  maxPlayers: number;
  players: string[];
}

interface IRoom {
  name: string;
  players: [
    {
      name: string;
      socketId: string;
    }
  ];
  open: boolean;
  numberOfPlayers: number;
  host: string;
}

const Start = ({ gameName, playerName }: IStartProps): JSX.Element => {
  const [game, setGame] = useState<IRoom>();


	const startGame = () => {
		socket.emit('start', { name: gameName });
	}

  useEffect(() => {
    socket.emit('getLobby', gameName);
    socket.on('lobby', (lobby: IRoom) => {
      setGame(lobby);
    });
  }, []);

  return !game ? (
    <Loading />
  ) : (
    <>
      <Container>
        <Row>
          <Col>GAME</Col>
          <Col>{game.name}</Col>
        </Row>
        <Row>
          <Col>PLAYERS</Col>
          {game.players.map((player) => (
            <Col
              style={{ color: player.name === playerName ? 'pink' : '' }}
              key={player.name}
            >
              {player.name}
            </Col>
          ))}
        </Row>
      </Container>
      {console.log(game)}
      {/* This button shall be visible only for the host of the game */}
      <Container>
        <Button variant="secondary" size="lg" block onClick={() => startGame()}>
          Start Game
        </Button>
      </Container>
    </>
  );
};

export default Start;
