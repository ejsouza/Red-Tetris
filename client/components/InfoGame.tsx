import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from 'styled-components';
import { IPiece } from '../interfaces';
import BoardGame from './BoardGame';
import MiniBoard from './MiniBoard';
import socket from '../utils/socket';
const Wrapper = styled.div`
  padding: 10px;
  display: inline-block;
  // max-width: 360px;
  // height: 100%;
  // overflow: auto;
  // background-color: #596269;
  background-color: #2196f3;
  border: 1px solid rgba(255, 255, 255, 1);
`;

interface IProps {
  player: string;
  piece: IPiece;
  board: number[][];
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
  display: block;
  // width: 200px;
`;

export const InfoGame = (props: IProps) => {
  const piece: number[][] = Array.from({ length: 2 }, () => Array(10).fill(0));
  const [boardShadow, setBoardShadow] = useState<number[][]>();

  props.piece.pos.forEach((pos) => {
    piece[pos.y][pos.x] = props.piece.color;
  });

  socket.on('boardShadow', (board: number[][]) => {
    setBoardShadow(board);
  });

  socket.on('shadow', (player: IPlayer) => {
    console.log(`got shadow >>>>> ${player}`);
  });
  return (
    <>
      <Container>
        <Row>
          <Col>
            {/* <Wrapper>
              <Row>
                <Col>Player: {props.player}</Col>
                <Col>Score:</Col>
              </Row>
              <BoardGame {...piece} />
            </Wrapper> */}

            <Row>
              <Col>Player: {props.player}</Col>
              <Col>Score:</Col>
            </Row>
            <Parent>
              <BoardGame {...piece} />
            </Parent>
          </Col>
        </Row>
        <Row>
          <Col>Following player</Col>
          <Col>Following player</Col>
        </Row>
        <Row>
          <Col>{boardShadow && <MiniBoard {...boardShadow} />}</Col>
        </Row>
      </Container>
    </>
  );
};