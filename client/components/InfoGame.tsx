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
  // const [shadows, setShadow] = useState<IShadow[]>([])
  const [shadows, setShadows] = useState<IShadow[]>([]);
	const [loading, setLoading] = useState(false);
	const [player, setPlayer] = useState<IShadow>();
	// const [shades, setShades] = useState<JSX.Element[][]>([]);
	const [shades, setShades] = useState<JSX.Element[][][]>([]);
	const [toggle, setToggle] = useState(false);

  props.piece.pos.forEach((pos) => {
    piece[pos.y][pos.x] = props.piece.color;
  });

 useEffect(() => {
   setTimeout(() => {
     setLoading(true);
   }, 2000);
 }, []);

  useEffect(() => {
    socket.on('boardShadow', (board: number[][]) => {
      setBoardShadow(board);
    });
  }, []);

  // useEffect(() => {
  //   socket.on('shaddy', (player: IShadow) => {
	// 		setPlayer(player);

	// 		setShadows(
	// 			shadows.map(shadow => shadow.player === player.player ? {...shadow} : player)
	// 		)
  //   });
  // }, []);

	useEffect(() => {
		socket.on('shaddy', () => {
			setToggle(!toggle);
		})
	}, []);


	useEffect(() => {
    // When page first load get array of players with their board
    socket.emit('getArrayOfPlayers', props.game, props.player);
  }, [player, toggle]);

	useEffect(() => {
    socket.on('arrayOfPlayers', (shadows: IShadow[]) => {
      setShadows([...shadows]);
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

      //   if(shadows) {
      //     let board: JSX.Element[][] = [];

      //     shadows.forEach((shade) => {
      //       board = Object.entries(shade.board).map((row) => {
      //         return row[1].map((cell) => (
      //           <GridItem
      //             style={{ background: colors[cell] }}
      //             key={`cell-${index++}`}
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

      if (shadows) {
        let board: JSX.Element[][][] = [];

        shadows.forEach((shade, i) => {
					console.log(`>>>>>>>>>>[${shade.player}] ${i}`);
          board[i] = Object.entries(shade.board).map((row) => {
            return row[1].map((cell) => (
              <GridItem
                style={{ background: colors[cell] }}
                key={`cell-${index++}-${shade.player}`}
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
    }, [shadows]);




  // useEffect(() => {
  // 	socket.on('shadow', (board: number[][], playerName: string) => {
  //   	// console.log(`got shadow >>>>> ${board}`);
  // 		let shade: IShadow = {
  // 			player: playerName,
  // 			board: board,
  // 		};
  // 		if (shadows.length > 0) {
  //       shadows.forEach((shadow) => {
  //         if (shadow.player === playerName) {
  //           shadow = shade;
  //         } else {
  //           shadows.push(shade);
  //         }
  //         setShadow(shadows => [...shadows, shade]);
  //       });
  //     } else {
  // 			 shadows.push(shade);
  // 		}
  // 	});
  // }, [])

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
        {/* <Col>{boardShadow && <MiniBoard map={boardShadow} shadows={shadows}/>}</Col> */}
        {/* <Col>{boardShadow && <MiniBoard shadows={shadows} />}</Col> */}
        <Parent>
          <Row>
            {/* <Col>{boardShadow && <MiniBoard />}</Col>
            <Col>{boardShadow && <MiniBoard />}</Col> */}
            {/* <Col>{shadows && <MiniBoard />}</Col> */}
          </Row>
        </Parent>
        {/* <Row>{shadows && <Grid>{shades}</Grid>}</Row> */}
        {/* <Row>{shadows && <Grid>{shades.map((shade) => shade)}</Grid>}</Row> */}
        <Row>{shadows && shades.map(shade => <Grid>{shade}</Grid>)}</Row>
      </Container>
    </>
  );
};
