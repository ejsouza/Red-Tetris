import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import selectPiece from '../features/piece/pieceSlice';
import { RootState } from '../store';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from 'styled-components';
import { IPiece, IShadow } from '../interfaces';
import BoardShadow from './BoardShadow';
import BoardGame from './BoardGame';
import MiniBoard from './MiniBoard';
import socket from '../utils/socket';
import {
  COLORS_WITH_WHITE,
  BOARD_COLORS,
  SHADOWS_UPDATED,
  PLAYER_SHADOW_UPDATED,
} from '../utils/const';

import {
  nextPieceUpdated,
  boardShadowsUpdated,
  boardPlayerShadowUpdated,
} from '../store/actions';
import { PIECES } from '../../rtAPI/src/utils/const';

const sizeOfGrid = 10;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${sizeOfGrid}, 1fr);
  background-color: #2196f3;
  border-bottom: 1px solid rgba(255, 255, 255, 1);
  border-left: 1px solid rgba(255, 255, 255, 1);
  line-height: 1;
  max-height: 270px;
  max-width: 130px;
`;

export const GridItem = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  max-height: 5px;
  max-width: 5px;
  border-top: 1px solid rgba(255, 255, 255, 1);
  border-right: 1px solid rgba(255, 255, 255, 1);
  padding: 6px;
  span {
    opacity: 0;
  }
`;

const Gap = styled.div<{ padding: string }>`
  padding: ${(props) => props.padding};
`;

interface IProps {
  player: string;
  game: string;
}

interface IBoard {
  shape: number[][];
  drawPiece(piece: IPiece): void;
  cleanPiece(piece: IPiece): void;
}

interface IPlayer {
  socketId: string;
  name: string;
  board: IBoard;
  piece: IPiece;
  nextPiece: IPiece[];
  isHost: boolean;
  score: number;
}

const Parent = styled.div`
  max-width: 308px;
`;

export const InfoGame = (props: IProps) => {
  const nextPiece: number[][] = Array.from({ length: 2 }, () =>
    Array(10).fill(0)
  );

  let key = 0;
  const dispatch = useAppDispatch();

  const nextPieceState = useAppSelector((state) => state.nextPiece);
  const playersBoard = useAppSelector((state) => state.shadows);
  const score = useAppSelector((state) => state.score);
  const level = useAppSelector((state) => state.level);
  const next = useAppSelector((state) => state.next);
  const nextP = PIECES[next[0]];

  // nextPieceState.pos.forEach((pos) => {
  //   if (pos.y < 2) {
  //     nextPiece[pos.y][pos.x] = nextPieceState.color;
  //   }
  // });
  if (nextP) {
    nextP.pos.forEach((pos) => {
      if (pos.y < 2) {
        nextPiece[pos.y][pos.x] = nextP.color;
      }
    });
  }

  useEffect(() => {
    socket.on('arrayOfPlayers', (shadows: IShadow[]) => {
      dispatch(boardShadowsUpdated([...shadows]));
    });

    socket.on('arrayOfPlayer', (shadow: IShadow) => {
      dispatch(boardPlayerShadowUpdated(shadow));
    });

    socket.on('gameInfo', (nextPiece: IPiece) => {
      dispatch(nextPieceUpdated(nextPiece));
    });
  }, []);

  const shadows = playersBoard.map((player, y) => {
    return (
      <>
        <Col>
          <Grid>
            {player.board.slice(2).map((row, index) => {
              return row.map((cell, x) => {
                return (
                  <GridItem
                    style={{ background: BOARD_COLORS[cell] }}
                    key={`${index}-${player.player}-${y}-${x}`}
                  >
                    <span>{cell}</span>
                  </GridItem>
                );
              });
            })}
          </Grid>
        </Col>
      </>
    );
  });

  return (
    <>
      <Container>
        <Row>
          <Col>
            <Row>
              <Col>Player: {props.player}</Col>
              <Col>Level: {level}</Col>
              <Col>Score: {score}</Col>
            </Row>
            {
              <Grid>
                {/* {nextPiece.map((row, i) =>
                  row.map((cell) => (
                    <GridItem
                      style={{ background: COLORS_WITH_WHITE[cell] }}
                      key={`shaddy-next-piece-${key++}-${props.player}-${row[i]}-${cell}`}
                    >
                      <span>{cell}</span>
                    </GridItem>
                  ))
                )} */}
                {next &&
                  nextPiece.map((row, i) =>
                    row.map((cell) => (
                      <GridItem
                        style={{ background: COLORS_WITH_WHITE[cell] }}
                        key={`shaddy-next-piece-${key++}-${props.player}-${
                          row[i]
                        }-${cell}`}
                      >
                        <span>{cell}</span>
                      </GridItem>
                    ))
                  )}
              </Grid>
            }
          </Col>
        </Row>
        <Row>
          {playersBoard.map((player, i) => {
            return (
              <Col key={`player-${player.player}-${i}`}>{player.player}</Col>
            );
          })}
        </Row>
        <Row>
          <BoardShadow />{' '}
        </Row>
        {/* <Row>{shadows}</Row> */}
      </Container>
    </>
  );
};
