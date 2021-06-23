import React, { useEffect, useState, useRef } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../store/hooks';
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
import {
  BOARD_UPDATED,
  PIECE_UPDATED,
  NEXT_PIECE_UPDATED,
} from '../utils/const';
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

interface IShadow {
  player: string;
  board: number[][];
}

interface IInitialState {
  board: number[][];
  piece: IPiece;
  nextPiece: IPiece;
  shadows: IShadow[];
}

const Game = ({ gameName, playerName }: IGameProps) => {
  // const [map, setMap] = useState<number[][]>();
  // const [piece, setPiece] = useState<IPiece>();
  const [nextPiece, setNextPiece] = useState<IPiece>();
  const [delay, setDelay] = useState((700 * 60) / 100);
  const [toggle, setToggle] = useState(false);
  const dispatch = useAppDispatch();
  const boardState = useAppSelector((state) => state.board);
  const pieceState = useAppSelector((state) => state.piece);

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
      const copyPiece: IPiece = Object.create(pieceState);

    // if (!map || !piece || !nextPiece) {
    //   return;
    // }
      if (!nextPiece) {
        return;
      }
    // if (isYPlusOneFree(map, piece)) {
    if (isYPlusOneFree(boardState, pieceState)) {
      /**
       * IMMUTABILITY
       * Maybe instead of mutating the map every time
       * could be better have a blanc map (i.e) a map set to zero
       * and instead of calling cleanPieceFromBoard()
       * setMap([mapZeroed])
       * so in another places I can just call
       * ...mapZeroed to create a copy
       */
      // cleanPieceFromBoard(map, piece);
      copyPiece.pos.forEach((pos) => {
        pos.y++;
        // map[pos.y][pos.x] = piece.color;
        boardState[pos.y][pos.x] = pieceState.color;
      });
      // setPiece(piece);
      // setMap([...map]);
      // setMap([...board]);
      dispatch({ type: PIECE_UPDATED, piece: copyPiece });
      // dispatch({ type: BOARD_UPDATED, board: map });
      dispatch({ type: BOARD_UPDATED, board: [...boardState] });
      // setMap([...board]);
    } else {
      if (isGameOver(boardState, nextPiece)) {
      // if (isGameOver(map, nextPiece)) {
        const copyPiece: IPiece = Object.create(pieceState);
        copyPiece.still = true;
        writeAsMuchAsPossibleToBoard(boardState, nextPiece);
        setDelay(0);
        // Be careful
        // socket.emit('gameOver', { gameName, playerName, map, piece });
        socket.emit('gameOver', { gameName, playerName, boardState, copyPiece });
        dispatch({ type: PIECE_UPDATED, piece: copyPiece });
        // dispatch({ type: BOARD_UPDATED, board: map });
        dispatch({ type: BOARD_UPDATED, board: [...boardState] });
      } else {
        if (score(boardState, copyPiece)) {
        // if (score(map, piece)) {
          socket.emit('applyPenalty', gameName);
        }
        // updatePiece(map, piece, nextPiece);
        // updatePiece(boardState, copyPiece, nextPiece);
        // stopped here *******
          dispatch({ type: PIECE_UPDATED, piece: nextPiece });
          dispatch({ type: BOARD_UPDATED, board: [...boardState] });

        // socket.emit('getNextPiece', { gameName, playerName, map, piece });
        socket.emit('getNextPiece', { gameName, playerName, boardState, copyPiece });
      }
    }
  }, delay);

  useEffect(() => {
    socket.on('nextPiece', (nextPiece: IPiece) => {
      dispatch({ type: NEXT_PIECE_UPDATED, nextPiece: nextPiece });
      setNextPiece(nextPiece);
    });
  }, []);

  useEffect(() => {
    socket.on('penalty', () => {
      setToggle(true);
      // const board = useAppSelector((state) => state.board);
      // if (map) {
        // TODO Check if player is still in game before applying penalty
        // penalty(map);
        penalty(boardState);
        // setMap([...map]);
        // dispatch({ type: BOARD_UPDATED, board: map });
        dispatch({ type: BOARD_UPDATED, board: [...boardState] });
      // }
    });
  }, [toggle]);

  useEffect(() => {
    socket.on('newMap', (map: number[][], piece: IPiece, nextPiece: IPiece) => {
      // setMap(map);
      // setPiece(piece);
      setNextPiece(nextPiece);
      dispatch({ type: BOARD_UPDATED, board: map });
      dispatch({ type: PIECE_UPDATED, piece: piece });
      dispatch({ type: NEXT_PIECE_UPDATED, nextPiece: nextPiece });
      /**
       * setToggle() is called here because otherwise map will be undefined
       * in the first penalty
       */
      setToggle(!toggle);
    });
  }, []);

  const handleKeyDown = (e: any) => {
    // if (!piece || !map) {
    //   return;
    // }
    // const boardState = useAppSelector((state) => state.board);
    // if (!piece) {
    //   return;
    // }
    const copyPiece: IPiece = Object.create(pieceState);
    if (e.key === 'ArrowLeft') {
      // updateBoard(map, piece, e.keyCode);
      // updateBoard(boardState, piece, e.keyCode);
      updateBoard(boardState, copyPiece, e.keyCode);
    }
    if (e.key === 'ArrowRight') {
      // updateBoard(map, piece, e.keyCode);
      // updateBoard(boardState, piece, e.keyCode);
      updateBoard(boardState, copyPiece, e.keyCode);
    }
    if (e.key === 'ArrowDown') {
      // updateBoard(map, piece, e.keyCode);
      // updateBoard(boardState, piece, e.keyCode);
      updateBoard(boardState, copyPiece, e.keyCode);
    }
    if (e.key === 'ArrowUp') {
      // updateBoard(map, piece, e.keyCode);
      // updateBoard(boardState, piece, e.keyCode);
      updateBoard(boardState, copyPiece, e.keyCode);
    }
    // setMap([...map]);
     dispatch({ type: BOARD_UPDATED, board: [...boardState] });
     dispatch({ type: PIECE_UPDATED, piece: copyPiece });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    //clean event
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pieceState]);

  // return !map || !nextPiece ? (
  return !nextPiece ? (
    <Loading />
  ) : (
    <>
      <Container>
        <Section>
          {/* <BoardGame b={map} /> */}
          <BoardGame />
        </Section>
        <Section>
          <InfoGame
            player={playerName}
            game={gameName}
            piece={nextPiece}
            // board={map}
          />
          {/* <MiniBoard /> */}
        </Section>
      </Container>
    </>
  );
};;;

// export default Game;
export default connect()(Game);
