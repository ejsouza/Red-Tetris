import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from 'styled-components';
import { IPiece, IShadow } from '../interfaces';
import BoardShadow from './BoardShadow';
import NextPiece from './NextPiece';
import PlayerDashBoard from './PlayerDashBoard';
import socket from '../utils/socket';
import { BOARD_WIDTH } from '../utils/const';

import {
  nextPieceUpdated,
  boardShadowsUpdated,
  boardPlayerShadowUpdated,
} from '../store/actions';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${BOARD_WIDTH}, 1fr);
  line-height: 1;
  max-height: 270px;
  max-width: 130px;
`;

export const GridItem = styled.div`
  max-height: 5px;
  max-width: 5px;
  padding: 6px;
  span {
    opacity: 0;
  }
`;

export const InfoGame = () => {
  const dispatch = useAppDispatch();
  const playersBoard = useAppSelector((state) => state.shadows);

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

  return (
    <>
      <Container>
        <Row>
          <Col>
            <PlayerDashBoard />
            <Grid>
              <NextPiece />
            </Grid>
          </Col>
        </Row>
        <Row>
          {playersBoard.map((player, i) => {
            return (
              <Col key={`player-${player.player}-${i}`} className="dashboard">
                {player.player}
              </Col>
            );
          })}
        </Row>
        <Row>
          <BoardShadow />
        </Row>
      </Container>
    </>
  );
};
