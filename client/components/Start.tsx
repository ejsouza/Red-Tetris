import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Loading from './Loading';
import Lobby from './Lobby';
import socket from '../utils/socket';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { isHostUpdated } from '../store/actions';

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
      isHost: boolean;
    }
  ];
  open: boolean;
  numberOfPlayers: number;
  host: boolean;
}

const Start = ({ gameName, playerName }: IStartProps): JSX.Element => {
  const [game, setGame] = useState<IRoom>();
  const [difficulty, setDifficulty] = useState<string | null>('recruit');
  const dispatch = useAppDispatch();
  const isHost = useAppSelector((state) => state.isHost);
  const startGame = () => {
    socket.emit('start', gameName, difficulty);
  };

  // useEffect(() => {

  // }, []);

  useEffect(() => {
    let isCancelled = false;
    socket.emit('getLobby', gameName);
    socket.on('lobby', (lobby: IRoom) => {
      const player = lobby.players.find((p) => p.name === playerName);
      console.log(
        `am I host ? ${player?.isHost} -- ${player?.name} - ${player?.socketId}`
      );
      if (player) {
        console.log(`setting isHOst after getLobby ==> ${player.isHost}`);
        console.log(`Name[${player.name}]`);
        // setHost(player.isHost);
      }
      if (!isCancelled) {
        setGame(lobby);
      }
    });

    socket.on('gameStart', () => {
      console.log('Starting Game...');
    });

    socket.on('game-host', () => {
      dispatch(isHostUpdated(true));
    });
    return () => {
      isCancelled = true;
    };
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
      {isHost ? (
        <Container>
          <div className="btn-group btn-block">
            <Button variant="secondary" size="lg" block onClick={startGame}>
              Start Game
            </Button>

            <DropdownButton
              variant="secondary"
              as={ButtonGroup}
              title="Difficulty"
              id="bg-nested-dropdown"
            >
              <Dropdown.Item
                eventKey="recruit"
                active={difficulty === 'recruit' ? true : false}
                onSelect={(eventKey) => setDifficulty(eventKey)}
              >
                Recruit
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="veteran"
                active={difficulty === 'veteran' ? true : false}
                onSelect={(eventKey) => setDifficulty(eventKey)}
              >
                Veteran
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="hardcore"
                active={difficulty === 'hardcore' ? true : false}
                onSelect={(eventKey) => setDifficulty(eventKey)}
              >
                Hardcore
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="insane"
                active={difficulty === 'insane' ? true : false}
                onSelect={(eventKey) => setDifficulty(eventKey)}
              >
                Insane
              </Dropdown.Item>
            </DropdownButton>
          </div>
        </Container>
      ) : (
        // <Container>
        //     <Button
        //       variant="secondary"
        //       size="lg"
        //       block
        //       onClick={() => startGame()}
        //     >
        //       Start Game
        //     </Button>
        //   </Container>

        <Lobby />
      )}
    </>
  );
};

export default Start;
