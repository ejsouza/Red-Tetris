import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from 'styled-components';
import { IPiece } from '../interfaces';
import BoardGame from './BoardGame';
import MiniBoard from './MiniBoard';
import socket from '../utils/socket';

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

const GridItem = styled.div`
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


interface IProps {
  player: string;
	game: string;
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

interface IShadow {
		player: string;
		board: number[][];
}

const Parent = styled.div`
  max-width: 308px;
`;

export const InfoGame = (props: IProps) => {
  const piece: number[][] = Array.from({ length: 2 }, () => Array(10).fill(0));
  const [boardShadow, setBoardShadow] = useState<number[][]>();
  const [shadows, setShadows] = useState<IShadow[]>([]);
  const [shades, setShades] = useState<JSX.Element[][][]>([]);
  const [players, setPlayers] = useState<IShadow[]>([]);
	const [nextPiece, setNextPiece] = useState<JSX.Element[][]>([]);

  props.piece.pos.forEach((pos) => {
    piece[pos.y][pos.x] = props.piece.color;
  });

  // useEffect(() => {
  //   socket.on('boardShadow', (board: number[][]) => {
  //     setBoardShadow(board);
  //   });
  // }, []);

  useEffect(() => {
    socket.on('shaddy', () => {
      socket.emit('getArrayOfPlayers', props.game, props.player);
    });
  }, []);

  useEffect(() => {
    socket.on('arrayOfPlayers', (shadows: IShadow[]) => {
      setShadows([...shadows]);
    });
  }, []);

  useEffect(() => {
    socket.on('player', (player: IShadow) => {
      if (players.length === 0) {
        players.push(player);
      } else {
        let playerFound = false;
        players.forEach((p) => {
          if (p.player === player.player) {
            playerFound = true;
            p.board = player.board;
          }
        });
        if (!playerFound) {
          players.push(player);
        }
      }
    });
  }, []);

  useEffect(() => {
    let index = 0;

    const colors = [
      '',
      '#ECF00B',
      '#8C00EC',
      '#1100EC',
      '#EB8E08',
      '#45F304',
      '#E90005',
      '#48EFEC',
      '#FC03db',
    ];

    if (players) {
      let board: JSX.Element[][][] = [];

      players.forEach((player, i) => {
        board[i] = Object.entries(player.board).map((row) => {
          return row[1].map((cell) => (
            <GridItem
              style={{ background: colors[cell] }}
              key={`cell-${index++}-${player.player}`}
            >
              <span>{cell}</span>
            </GridItem>
          ));
        });
      });
      if (board.length < 1) {
        return;
      }
      setShades(board);
    }
		   
    const nextP = piece.map((row) =>
      row.map((cell) => (
        <GridItem
          style={{ background: colors[cell] }}
            key={`cell-${cell}`}
          >
            <span>{cell}</span>
        </GridItem>
      ))
    );
		setNextPiece(nextP);
        
  }, [shadows]);


  return (
    <>
      <Container>
        <Row>
          <Col>
            <Row>
              <Col>Player: {props.player}</Col>
              <Col>Score:</Col>
            </Row>
            <Parent>
              {/* TODO This causes the "key" should be unique error */}
              {/* <BoardGame {...piece} /> */}

              {piece.map(row => row.map(cell => {
								// <GridItem>
									cell
								// </GridItem>
							})) }
            </Parent>
          </Col>
        </Row>
        <Row>
          {players.map((player) => (
            <Col>{player.player}</Col>
          ))}
        </Row>
        <Row>
          {shadows &&
            Object.values(shades).map((shade) => (
              <Col>
                <Grid>{shade}</Grid>
              </Col>
            ))}
        </Row>
      </Container>
    </>
  );
};
