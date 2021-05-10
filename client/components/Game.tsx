import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { RT_API } from '../utils/const';
import BoardGame from '../components/BoardGame';
import styled, { createGlobalStyle, css } from 'styled-components';
import socket from '../utils/socket';
import Loading from '../components/Loading';
import lookup from 'socket.io-client';

const Container = styled.div`
  padding: 16px;
`;

const Section = styled.div`
  max-width: 360px;
  height: auto;
  margin: auto;
`;

interface Piece {
  tetrominio: number[][];
  x: number;
  y: number;
}

// interface Piece {
//   tetrominio: [number[][]];
//   x: number;
//   y: number;
// }

const Game = () => {
  const [map, setMap] = useState<number[][]>();
  socket.on('setGame', (arg: boolean) => {
    console.log(`In Front game resonse ${arg}`);
  });

  const gameLoop = (map: number[][], piece: Piece) => {
    setTimeout(() => {
      socket.emit('updateMap', map, piece);
    }, 2000);
  };
  socket.on('newMap', (map: number[][], piece: Piece) => {
    console.log('reciving... ', Object.entries(map).values);
    console.log('map ', map);
    console.log('piece ', piece);
    Object.values(map).forEach((val) => {
      console.log(`what here ${val}`);
    });
    setMap(map);
    gameLoop(map, piece);
  });
  useEffect(() => {
    socket.emit('getGameMap', { requestmap: true });
  }, []);
  return !map ? (
    <Loading />
  ) : (
    <>
      <Container>
        <Section>
          <div>Game</div>
          <BoardGame {...map} />
        </Section>
      </Container>
    </>
  );
};

export default Game;
