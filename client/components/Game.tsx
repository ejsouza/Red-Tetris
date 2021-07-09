import React, { useEffect, useState, useRef } from 'react';
import { throttle } from 'throttle-debounce';
import { connect, useSelector, useDispatch } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import BoardGame from './BoardGame';
import { InfoGame } from './InfoGame';
import LostGame from './LostGame';
import GameWinner from './GameWinner';
import styled from 'styled-components';
import socket from '../utils/socket';
import { emitFrontState, emitStatePieceUpdated } from '../utils/emiter';
import { IPiece, IShadow } from '../interfaces';
import {
  update,
  handleKeyDown,
  playerScores,
  isMoveDownAllowed,
  gameOver,
  calculateScore,
  calculateLevel,
  penalty,
  resetBoard,
} from '../core/gameEngine';
import {
  pieceUpdated,
  nextPieceUpdated,
  boardUpdated,
  scoreUpdated,
  boardPlayerShadowUpdated,
  nextUpdated,
  levelUpdated,
  resetStore,
} from '../store/actions';
import { PIECES } from '../../rtAPI/src/utils/const';
import { IState } from '../utils/emiter';
import { MIN_PIECES, EMPTY_BOARD } from '../utils/const';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  // max-height: 640px;
  justify-content: center;
  // justify-content: space-around;
  // justify-content: space-between;
  padding: 16px;
`;

const Gap = styled.div<{ padding: string }>`
  padding: ${(props) => props.padding};
`;

const Section = styled.div`
  // max-width: 360px;
`;

interface ICallback {
  (): void;
}

interface IGameProps {
  gameName: string;
  playerName: string;
}

interface IProps {
  isHost: boolean;
}

interface IPlayerState {
  at: number;
  piece: IPiece;
  score: number;
  nextPiece: number[];
}

const Game = ({ gameName, playerName }: IGameProps): JSX.Element => {
  const [youLost, setYouLost] = useState(false);
  const [youWin, setYouWin] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [clearedLines, setClearedLines] = useState(0);
  // const [gameOver, setGameOver] = useState(false);
  const [delay, setDelay] = useState((700 * 60) / 100);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const dispatch = useAppDispatch();
  const boardState = useAppSelector((state) => state.board);
  const pieceState = useAppSelector((state) => state.piece);
  const nextPieceState = useAppSelector((state) => state.nextPiece);
  const score = useAppSelector((state) => state.score);
  const piece = useAppSelector((state) => state.piece);
  const board = useAppSelector((state) => state.board);
  const next = useAppSelector((state) => state.next);
  const level = useAppSelector((state) => state.level);

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
        setIntervalId(id);
        return () => clearInterval(id);
      }
    }, [delay]);
  };

  useEffect(() => {
    socket.on('update-next-piece', (piece: number[]) => {
      piece.forEach((n) => next.push(n));
      dispatch(nextUpdated(next));
    });
    socket.on('extra-pieces', (piece: number[]) => {
      piece.forEach((n) => next.push(n));
      dispatch(nextUpdated(next));
    });
    socket.on('got-penalty', () => {
      dispatch(boardUpdated(penalty([...board])));
    });

  }, []);

  useInterval(() => {
  if (
      isMoveDownAllowed([...board], JSON.parse(JSON.stringify(piece)))
    ) {
      const [b, p] = update([...board], JSON.parse(JSON.stringify(piece)));
      // timestamp and send front state to server
      dispatch(pieceUpdated(p));
      dispatch(boardUpdated(b));
      return;
    } else {
      if (gameOver(board)) {
        setDelay(0);
        if (intervalId) {
          clearInterval(intervalId);
        }
        socket.emit('player-lost', playerName);
      } 
      const points = playerScores(board, piece);
      if (points) {
        socket.emit('apply-penalty', gameName);
        setClearedLines(prev => prev + points);
        dispatch(scoreUpdated(score + calculateScore(level, points)));
        dispatch(levelUpdated(calculateLevel(clearedLines)));
      }
      const index = next.shift();
      if (next.length === MIN_PIECES) {
        socket.emit('get-extra-pieces', gameName);
      }
      if (index !== undefined) {
        const piece = PIECES[index];

        dispatch(nextUpdated(next));
        dispatch(pieceUpdated(piece));
        const currentState = {
          playerName,
          gameName,
          board,
          piece,
          next,
          score,
          at: Date.now(),
        };
        emitFrontState(currentState);
      }
    }
  }, delay);


  // ************************* Start Game V1 ***********************
  // listen for game start

  // ************************* End Game V1 ***********************

  useEffect(() => {
    // socket.on('newMap', (map: number[][], piece: IPiece, nextPiece: IPiece) => {
    //   dispatch(boardUpdated(map));
    //   dispatch(pieceUpdated(piece));
    //   dispatch(nextPieceUpdated(nextPiece));
    //   console.log(`GOT NEW MAP >>>>`);
    // });

    socket.on('score', (score: number) => {
      dispatch(scoreUpdated(score));
    });

    socket.on('youLost', (playerHost: boolean) => {
      console.log(`on youLost >> ${isHost}`);
      // socket.emit('loser', playerName, gameName);
      setIsHost(playerHost);
      setYouLost(true);
      if (intervalId) {
        clearInterval(intervalId);
      }
      setDelay(0);
    });

    socket.on('youWin', (playerHost: boolean) => {
      // socket.emit('winner', playerName, gameName);
      setIsHost(playerHost);
      setYouWin(true);
      if (intervalId) {
        clearInterval(intervalId);
      }
      setDelay(0);
    });

    socket.on('gameOver', () => {
      socket.emit('stopGame', gameName);
    });

    socket.on('updateBoard', (board: number[][]) => {
      dispatch(boardUpdated([...board]));
    });
    socket.on('startLoop', (piece: IPiece) => {
      console.log('Starting Game... ', piece.color);
      dispatch(pieceUpdated(piece));
    });
  }, []);

  // useEffect(() => {
  //   socket.on('gameUpdate', (msg: string) => {
  //     console.log(`FROM GAME ${msg}...`);
  //   });
  // }, []);

  // const throttleHandleKeyDown = throttle(400, (e: KeyboardEvent) => {
  // const k = e.key;
  // socket.emit('keydown', {
  //   key: k,
  //   gameName,
  //   playerName,
  // });
  const keyDown = (e: KeyboardEvent) => {
    const [b, p] = handleKeyDown(
      [...board],
      JSON.parse(JSON.stringify(piece)),
      e.key
    );
    if (b && p) {
      dispatch(pieceUpdated(p));
      dispatch(boardUpdated(b));
    }
  };

  // useEffect(() => {
  //   socket.on('updateBoard', (board: number[][]) => {
  //     dispatch(boardUpdated([...board]));
  //   });
  // }, []);

  useEffect(() => {
    window.addEventListener('keydown', keyDown);
    //clean event
    return () => {
      window.removeEventListener('keydown', keyDown);
    };
  }, [piece]);

  return (
    <>
      <Container>
        <Section>
          <BoardGame />
        </Section>
        <Section>
          <InfoGame player={playerName} game={gameName} />
        </Section>
      </Container>
      {youLost && <LostGame player={playerName} game={gameName}  isHost={isHost} />}
      {youWin && <GameWinner  player={playerName} game={gameName}  isHost={isHost} />}
    </>
  );
};

export default connect()(Game);
