import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import BoardGame from './BoardGame';
import { InfoGame } from './InfoGame';
import LostGame from './LostGame';
import GameWinner from './GameWinner';
import styled from 'styled-components';
import socket from '../utils/socket';
import { emitFrontState } from '../utils/emiter';
import { IPiece } from '../interfaces';
import {
  update,
  handleKeyDown,
  playerScores,
  isMoveDownAllowed,
  gameOver,
  calculateScore,
  calculateLevel,
  penalty,
} from '../core/gameEngine';
import {
  pieceUpdated,
  boardUpdated,
  scoreUpdated,
  nextUpdated,
  levelUpdated,
} from '../store/actions';
import { updateScore } from '../core/user';
import { PIECES } from '../utils/const';
import { MIN_PIECES, RECRUIT } from '../utils/const';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 16px;
`;

const Section = styled.div``;

interface ICallback {
  (): void;
}

interface IGameProps {
  gameName: string;
  playerName: string;
  hardness: number;
}

const Game = ({ gameName, playerName, hardness }: IGameProps): JSX.Element => {
  const [youLost, setYouLost] = useState(false);
  const [youWin, setYouWin] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [clearedLines, setClearedLines] = useState(0);
  const [delay, setDelay] = useState(RECRUIT);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const dispatch = useAppDispatch();
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

  useInterval(() => {
    if (isMoveDownAllowed([...board], JSON.parse(JSON.stringify(piece)))) {
      const [b, p] = update([...board], JSON.parse(JSON.stringify(piece)));
      dispatch(pieceUpdated(p));
      dispatch(boardUpdated(b));
      return;
    } else {
      if (gameOver(board)) {
        setDelay(0);
        if (intervalId) {
          clearInterval(intervalId);
        }
      }
      const points = playerScores(board, piece);
      if (points) {
        socket.emit('apply-penalty', gameName, playerName);
        setClearedLines((prev) => prev + points);
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

  useEffect(() => {
    let isCancelled = false;
    socket.on(
      'youLost',
      (player: { gameOver: boolean; multiplayer: number }) => {
        updateScore(score, level, player.multiplayer, false, true);
        if (!isCancelled) {
          setIsGameOver(player.gameOver);
          setYouLost(true);
          setDelay(0);
          if (intervalId) {
            clearInterval(intervalId);
          }
        }
      }
    );
  }, [score, level]);

  useEffect(() => {
    let isCancelled = false;

    socket.on('score', (score: number) => {
      dispatch(scoreUpdated(score));
    });

    socket.on('youWin', (player: { multiplayer: number }) => {
      updateScore(score, level, player.multiplayer, true, false);
      if (!isCancelled) {
        setDelay(0);
        setYouWin(true);
        if (intervalId) {
          clearInterval(intervalId);
        }
      }
    });

    socket.on('player-closed-tab', (playerName: string, gameName: string) => {
      socket.emit('player-quit', gameName, playerName);
    });

    socket.on('updateBoard', (board: number[][]) => {
      dispatch(boardUpdated([...board]));
    });
    socket.on('startLoop', (piece: IPiece) => {
      dispatch(pieceUpdated(piece));
    });

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

    if (hardness) {
      setDelay(hardness);
    }

    return () => {
      isCancelled = true;
    };
  }, []);

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

  useEffect(() => {
    window.addEventListener('keydown', keyDown);
    //clean event
    return () => {
      window.removeEventListener('keydown', keyDown);
    };
  }, [piece]);

  return (
    <>
      <Container className="game">
        <Section>
          <BoardGame />
        </Section>
        <Section>
          <InfoGame player={playerName} game={gameName} />
        </Section>
      </Container>
      {youLost && (
        <LostGame player={playerName} game={gameName} gameOver={isGameOver} />
      )}
      {youWin && (
        <GameWinner player={playerName} game={gameName} gameOver={isGameOver} />
      )}
    </>
  );
};

export default connect()(Game);
