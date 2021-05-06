import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Loading from './Loading';
import { getGameByName } from '../core/games';

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

const Start = ({ gameName, playerName }: IStartProps): JSX.Element => {
  const [game, setGame] = useState<IGame>();
	 const router = useRouter();
   const url = router.asPath;

   console.log(`in Start route is := ${url}`);

	 useEffect(() => {
		getGameByName(gameName).then((res) => {
  		res.json().then((res) => {
    	setGame(res.game);
  	});
		});
	 }, [])

  

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
            <Col style={{color: player === playerName ? 'pink' : 'read'}} key={player}>{player}</Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Start;
