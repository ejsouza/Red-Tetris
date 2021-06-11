import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import socket from '../utils/socket';
import { BOARD_HEIGHT, BOARD_WIDTH } from '../utils/const';

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

interface IShadow {
  player: string;
  board: number[][];
}

interface IProps {
	map?: number[][];
	shadows: IShadow[];
}

// const MiniBoard:  React.FC<IProps> = ({map, shadows}) => {
const MiniBoard = () => {

		const [shadows, setShadow] = useState<IShadow[]>([]);
		const [shades, setShades] = useState<JSX.Element[][]>([])

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
	// console.log(`MiniBoard called`);


		useEffect(() => {
			socket.on('shade', (shades: IShadow[]) => {
			let board: JSX.Element[][] = [];

				shades.forEach(shade => {
					board = Object.entries(shade.board).map((row) => {
            return row[1].map((cell) => (
              <GridItem
                style={{ background: colors[cell] }}
                key={`cell-${index++}`}
              >
                <span>{cell}</span>
              </GridItem>
            ));
          });
				})
				if (board.length < 1) {
					return ;
				}
				setShades(board);
			});
    }, []);

  return <Grid>{shades}</Grid>;

	  // return (
    //   <>
    //     {shades.map((shade) => (
    //       <Col>
    //         <Grid>{shade}</Grid>
    //       </Col>
    //     ))}
    //   </>
    // );
};

export default MiniBoard;
