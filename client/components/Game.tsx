import React, { useEffect, useState, useRef } from 'react';
import BoardGame from './BoardGame';
import { InfoGame } from './InfoGame';
import styled from 'styled-components';
import socket from '../utils/socket';
import Loading from './Loading';
import MiniBoard from './MiniBoard';
import {
  updateBoard,
  cleanPieceFromBoard,
  isYPlusOneFree,
  isGameOver,
  updatePiece,
  score,
  penalty,
  writeAsMuchAsPossibleToBoard,
} from '../core/gameEngine';
import { IPiece } from '../interfaces';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  // max-height: 640px;
  justify-content: center;
  // justify-content: space-around;
  // justify-content: space-between;
  padding: 16px;
`;

const Section = styled.div`
  // max-width: 360px;
`;

interface ICallback {
  (): void
}

interface IGameProps {
  gameName: string;
  playerName: string;
}

const Game = ({ gameName, playerName }: IGameProps) => {
  const [map, setMap] = useState<number[][]>();
  const [piece, setPiece] = useState<IPiece>();
  const [nextPiece, setNextPiece] = useState<IPiece>();
  const [delay, setDelay] = useState((700 * 60) / 100);
  const [toggle, setToggle] = useState(false);

  const useInterval = (callback: ICallback, delay: number) => {
    // https://overreacted.io/making-setinterval-declarative-with-react-hooks/
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
      /**
       * IMMUTABILITY
       * Maybe instead of mutating the map every time
       * could be better have a blanc map (i.e) a map set to zero
       * and instead of calling cleanPieceFromBoard()
       * setMap([mapZeroed])
       * so in another places I can just call
       * ...mapZeroed to create a copy
       */
      cleanPieceFromBoard(map, piece);
      piece.pos.forEach((pos) => {
        pos.y++;
        map[pos.y][pos.x] = piece.color;
      });
      setPiece(piece);
      setMap([...map]);
    } else {
      if (isGameOver(map, nextPiece)) {
        piece.still = true;
        writeAsMuchAsPossibleToBoard(map, nextPiece);
        setDelay(0);
        // Be careful
        socket.emit('gameOver', { gameName, playerName, map, piece });
      } else {
        if (score(map, piece)) {
          socket.emit('applyPenalty', gameName);
        }
        updatePiece(map, piece, nextPiece);
        socket.emit('getNextPiece', { gameName, playerName, map, piece });
      }
    }
  }, delay);

  useEffect(() => {
    socket.on('nextPiece', (nextPiece: IPiece) => {
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
    socket.on(
      'newMap',
      (board: number[][], piece: IPiece, nextPiece: IPiece) => {
        setMap(board);
        setPiece(piece);
        setNextPiece(nextPiece);
        /**
         * setToggle() is called here because otherwise map will be undefined
         * in the first penalty
         */
        setToggle(!toggle);
      }
    );
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
    }
    if (e.key === 'ArrowUp') {
      updateBoard(map, piece, e.keyCode);
    }
    setMap([...map]);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    //clean event
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [piece]);

  return !map || !nextPiece ? (
    <Loading />
  ) : (
    <>
      <Container>
        <Section>
          <BoardGame {...map} />
        </Section>
        <Section>
          <InfoGame
            player={playerName}
            game={gameName}
            piece={nextPiece}
            board={map}
          />
          {/* <MiniBoard /> */}
        </Section>
      </Container>
    </>
  );
};

export default Game;
