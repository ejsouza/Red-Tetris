import { IPiece, IShadow, IUser } from '../interfaces';
import {
  PIECE_UPDATED,
  NEXT_PIECE_UPDATED,
  NEXT_UPDATED,
  BOARD_UPDATED,
  SHADOWS_UPDATED,
  PLAYER_SHADOW_UPDATED,
  PLAYER_SCORE_UPDATED,
  PLAYER_LEVEL_UPDATED,
  PLAYER_IS_GAME_HOST,
  STORE_RESET,
  USER_LOGGED_UPDATED,
} from '../utils/const';

const resetStore = () => {
  return { type: STORE_RESET };
};

const pieceUpdated = (piece: IPiece) => {
  return { type: PIECE_UPDATED, piece };
};

const nextPieceUpdated = (nextPiece: IPiece) => {
  return { type: NEXT_PIECE_UPDATED, nextPiece };
};

const nextUpdated = (next: number[]) => {
  return { type: NEXT_UPDATED, next };
};

const boardUpdated = (board: number[][]) => {
  return { type: BOARD_UPDATED, board };
};

const boardShadowsUpdated = (shadows: IShadow[]) => {
  return { type: SHADOWS_UPDATED, shadows };
};

const boardPlayerShadowUpdated = (player: IShadow) => {
  return { type: PLAYER_SHADOW_UPDATED, player };
};

const scoreUpdated = (score: number) => {
  return { type: PLAYER_SCORE_UPDATED, score };
};

const levelUpdated = (level: number) => {
  return { type: PLAYER_LEVEL_UPDATED, level };
};

const isHostUpdated = (isHost: boolean) => {
  return { type: PLAYER_IS_GAME_HOST, isHost };
};

const userLoggetdUpdated = (user: IUser) => {
  return { type: USER_LOGGED_UPDATED, user };
};

export {
  pieceUpdated,
  nextPieceUpdated,
  nextUpdated,
  boardUpdated,
  boardShadowsUpdated,
  boardPlayerShadowUpdated,
  scoreUpdated,
  levelUpdated,
  resetStore,
  isHostUpdated,
  userLoggetdUpdated,
};
