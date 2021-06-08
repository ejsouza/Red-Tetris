import React from 'react';
import styled from 'styled-components';

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

const MiniBoard = (props: number[][]) => {
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
  // console.table(props);
  const board = Object.entries(props).map((row) => {
    return row[1].map((cell) => (
      <GridItem style={{ background: colors[cell] }} key={`cell-${index++}`}>
        <span>{cell}</span>
      </GridItem>
    ));
  });

  return <Grid>{board}</Grid>;
};

export default MiniBoard;
