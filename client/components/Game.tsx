import React, { useEffect, useState, useRef } from 'react';
import BoardGame from '../components/BoardGame';
import styled, { createGlobalStyle, css } from 'styled-components';
import socket from '../utils/socket';
import Loading from '../components/Loading';
import {BOARD_HEIGHT, BOARD_WIDTH} from '../utils/const';
import { updateBoard, cleanPieceFromBoard } from '../core/gameEngine';

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

interface ICallback {
  fn: () => void
}

const Game = () => {
  const [map, setMap] = useState<number[][]>();
  const [newMap, setNewMap] = useState(false);
  const [piece, setPiece] = useState<Piece>();
  const mapRef = useRef(map);

  // ---- TEST LOOP ON THE FRONT ----

  
function useInterval(callback: ICallback, delay: number) {
  const savedCallback = useRef<ICallback | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

  const updateGame = () => {
    console.log(`updateGame() called`);
    if (!map || !piece) {
      return;
    }
    console.log('gets here');
    cleanPieceFromBoard(map, piece);
    setMap([...map]);
  };
  const gameLoop = (board: number[][], piece: Piece, nextPiece: Piece) => {
    console.log(`gameloop `, map);
    let count = 0;
    const interval = setInterval(
      () => {
        count++;
        updateGame();
        console.log(`map ${map}`);
        console.log(`counting ${count}`);
        if (count === 5) {
          clearInterval(interval);
        }
      },
      (900 * 60) / 100,
      map,
      piece
    );
  };
  useEffect(() => {
    socket.on('newMap', (board: number[][], piece: Piece, nextPiece: Piece) => {
      console.log('got newMap ', board);
      setMap(board);
      setPiece(piece);
      gameLoop(board , piece, nextPiece);
    });
  }, []);

  // ---- ENT TESTING

  useEffect(() => {
    socket.on('gameState', (board: number[][], piece: Piece) => {
      setMap(board);
      setPiece(piece);
    });
  }, []);

  useEffect(() => {
    socket.on('newMap', (map: number[][], piece: Piece) => {
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
      setMap(map);
    }
    if (e.key === 'ArrowUp') {
      updateBoard(map, piece, e.keyCode);
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
