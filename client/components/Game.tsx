import React, { useEffect, useState, useRef } from 'react';
import BoardGame from '../components/BoardGame';
import styled, { createGlobalStyle, css } from 'styled-components';
import socket from '../utils/socket';
import Loading from '../components/Loading';
import {BOARD_HEIGHT, BOARD_WIDTH} from '../utils/const';
import {
  updateBoard,
  cleanPieceFromBoard,
  isYPlusOneFree,
  isGameOver,
  updatePiece,
  score,
  penalty,
} from '../core/gameEngine';

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
(): void
}

interface IGameProps {
  gameName: string;
  playerName: string;
}

const Game = ({ gameName, playerName }: IGameProps) => {
  const [map, setMap] = useState<number[][]>();
  const [piece, setPiece] = useState<Piece>();
  const [nextPiece, setNextPiece] = useState<Piece>();
  const [delay, setDelay] = useState((700 * 60) / 100);
  const [toggle, setToggle] = useState(false);

  // ---- TEST LOOP ON THE FRONT ----

  const useInterval = (callback: ICallback, delay: number) => {
    const savedCallback = useRef<ICallback | null>();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        if (savedCallback.current) {
          savedCallback.current();
        }
      }
      if (delay !== 0) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  };

  useInterval(() => {
    if (!map || !piece || !nextPiece) {
      return;
    }
    if (isYPlusOneFree(map, piece)) {
      cleanPieceFromBoard(map, piece);
      piece.pos.forEach((pos) => {
        pos.y++;
        map[pos.y][pos.x] = piece.color;
      });
    } else {
      if (isGameOver(piece)) {
        setDelay(0);
      } else {
        if (score(map, piece)) {
          socket.emit('applyPenalty', gameName);
        }
        updatePiece(map, piece, nextPiece);
        socket.emit('getNextPiece', { gameName, playerName, map, piece });
      }
    }
    setPiece(piece);
    setMap([...map]);
  }, delay);

  useEffect(() => {
    socket.on('nextPiece', (nextPiece: Piece) => {
      setNextPiece(nextPiece);
    });
  }, []);

  useEffect(() => {
    socket.on('penalty', () => {
      setToggle(true);
      if (map) {
        // TODO Check if player is still in game before applying penalty
        penalty(map);
        setMap([...map]);
      }
    });
  }, [toggle]);

  useEffect(() => {
    socket.on('newMap', (board: number[][], piece: Piece, nextPiece: Piece) => {
      setMap(board);
      setPiece(piece);
      setNextPiece(nextPiece);
      setToggle(!toggle);
    });
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
      // setMap(map);
    }
    if (e.key === 'ArrowUp') {
      updateBoard(map, piece, e.keyCode);
    }
    setMap([...map]);
    // setPiece(piece);
    // socket.emit('keydown', { key: e.keyCode, board: map, piece: piece });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    //clean event
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [piece]);

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
