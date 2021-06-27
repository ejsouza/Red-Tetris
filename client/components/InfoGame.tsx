import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectPiece } from '../features/piece/pieceSlice';
import { RootState } from '../store';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from 'styled-components';
import { IPiece, IShadow } from '../interfaces';
import BoardGame from './BoardGame';
import MiniBoard from './MiniBoard';
import socket from '../utils/socket';
import {
  COLORS_WITH_WHITE,
  BOARD_COLORS,
  SHADOWS_UPDATED,
} from '../utils/const';

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

  // const [shadows, setShadows] = useState<IShadow[]>([]);
  const [shades, setShades] = useState<JSX.Element[][][]>([]);
  // const [players, setPlayers] = useState<IShadow[]>([]);
  // const [nextPiece, setNextPiece] = useState<JSX.Element[][]>([]);
  let key = 0;
  const dispatch = useAppDispatch();

  const nextPieceState = useAppSelector((state) => state.nextPiece);
  const playersBoard = useAppSelector((state) => state.shadows);

  // console.log(`got Shadows ${playersBoard} -- ${playersBoard.length}`);

  // playersBoard.forEach((player) => console.log(`--?> ${player.player}`));

  // console.log(`nextPieceState := ${nextPieceState.color}`);
  // console.log(`piece := ${pc.pos[0].y} ${pc.pos[0].x}`);

  nextPieceState.pos.forEach((pos) => {
    if (pos.y < 2) {
      nextPiece[pos.y][pos.x] = nextPieceState.color;
    }
  });

  // if (!nextPiece) {
  //   console.log('***************/|/*************');
  // }
  // nextPieceState.pos.forEach((pos) => {
  //   nextPiece[pos.y][pos.x] = nextPieceState.color;
  // });

  useEffect(() => {
    socket.on('shaddy', () => {
      socket.emit('getArrayOfPlayers', props.game, props.player);
    });
  }, []);

  useEffect(() => {
    socket.on('arrayOfPlayers', (shadows: IShadow[]) => {
      /**
       * Need to use the object (or array) spread operator when
       * updating deeply-nested items within state
       * (anything deeper than the first level).
       */
      // shadows.forEach(shadow => console.log(`?? ${shadow.player} => ${shadow.board}`))
      // setShadows([...shadows]);
      dispatch({ type: SHADOWS_UPDATED, shadows: [...shadows] });
    });
  }, []);

  useEffect(() => {
    /**
     * Rethink this logic
     * React components will re-render whenever their parent re-render
     * or whenever you change their state with 'setState'
     *
     * For setPlayers() to work here I need to create a copy of the object
     * (Immutability)
     */
    // socket.on('player', (player: IShadow) => {
      // console.log(`got ${player.player} board => ${player.board}`)
    //   if (players.length === 0) {
    //     players.push(player);
    //   } else {
    //     let playerFound = false;
    //     players.forEach((p) => {
    //       if (p.player === player.player) {
    //         playerFound = true;
    //         p.board = player.board;
    //       }
    //     });
    //     if (!playerFound) {
    //       players.push(player);
    //     }
    //   }
    // });
  }, []);

  useEffect(() => {
    let index = 0;
    if (playersBoard.length > 0) {
      let board: JSX.Element[][][] = [];

      playersBoard.forEach((player, i) => {
        // console.log(`${player.player}[${i}] ${player.board}`);
        // console.table(player.board);
        board[i] = player?.board?.map((row) => {
          return(
            row.map(cell => {
             return (
               <GridItem
                 style={{ background: BOARD_COLORS[cell] }}
                 key={`cell-${index++}-${player.player}`}
               >
                 <span>{cell}</span>
               </GridItem>
             );
            })
          )
        })
      });
      if (board.length < 1) {
        return;
      }
      setShades(board);
    }
  }, [playersBoard]);

  // useEffect(() => {
  //   let index = 0;

  //   if (players) {
  //     let board: JSX.Element[][][] = [];

  //     players.forEach((player, i) => {
  //       board[i] = Object.entries(player.board).map((row) => {
  //         return row[1].map((cell) => (
  //           <GridItem
  //             style={{ background: BOARD_COLORS[cell] }}
  //             key={`cell-${index++}-${player.player}`}
  //           >
  //             <span>{cell}</span>
  //           </GridItem>
  //         ));
  //       });
  //     });
  //     if (board.length < 1) {
  //       return;
  //     }
  //     setShades(board);
  //   }
  // }, [shadows]);

  return (
    <>
      <Container>
        <Row>
          <Col>
            <Row>
              <Col>Player: {props.player}</Col>
              <Col>Score:</Col>
            </Row>
            {
              <Grid>
                {nextPiece.map((row) =>
                  row.map((cell) => (
                    <GridItem
                      style={{ background: COLORS_WITH_WHITE[cell] }}
                      key={`shaddy-next-piece-${key++}-${props.player}`}
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
          {playersBoard?.map((player) => (
            <Col key={`player-${player.player}`}>{player.player}</Col>
          ))}
        </Row>
        <Row>
          {shades &&
            Object.values(shades).map((shade, index) => (
              <Col key={`shadow-board-${index}`}>
                <Grid>{shade}</Grid>
              </Col>
            ))}
        </Row>
      </Container>
    </>
  );
};
