import React, { useEffect, useState, KeyboardEventHandler } from 'react';
import BoardGame from '../components/BoardGame';
import styled, { createGlobalStyle, css } from 'styled-components';
import socket from '../utils/socket';
import Loading from '../components/Loading';
import {BOARD_HEIGHT, BOARD_WIDTH} from '../utils/const';
import {updateBoard} from '../core/gameEngine';

const Container = styled.div`
  padding: 16px;
`;

const Section = styled.div`
  max-width: 360px;
  height: auto;
  margin: auto;
`;


interface Piece {
  pos: { x: number; y: number }[];
  width: number;
  height: number;
  color: number;
}


const Game = () => {
  const [map, setMap] = useState<number[][]>();
  const [newMap, setNewMap] = useState(false);
  const [piece, setPiece] = useState<Piece>();

  useEffect(() => {
    socket.on('gameState', (board: number[][], piece: Piece) => {
      setMap(board);
      setPiece(piece);
    });
  }, []);

  useEffect(() => {
    socket.on('newMap', (map: number[][], piece: Piece) => {
      console.log('got newMap on front');
      setMap(map);
      setPiece(piece);
    });
  }, [newMap]);

  useEffect(() => {
    socket.emit('getGameMap');
    setNewMap(true);
  }, []);

  const handleKeyDown = (e: any) => {
    if (!piece || !map) {
      console.log(`returning....`);
      return;
    }

    if (e.key === 'ArrowLeft') {
      updateBoard(map, piece, e.keyCode);
    }
    if (e.key === 'ArrowRight') {
      updateBoard(map, piece, e.keyCode);
    }
    if (e.key === 'ArrowDown') {
      updateBoard(map, piece, e.keyCode);
    }
    if (e.key === 'ArrowUp') {
      console.log('UP UP UP ', e.keyCode);
    }
   
    socket.emit('keydown', { key: e.keyCode, board: map, piece: piece });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    //clean event
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [piece]);

  useEffect(() => {
    socket.on('updateMove', (map: number[][], piece: Piece) => {
      setMap(map);
      setPiece(piece);
    });
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
