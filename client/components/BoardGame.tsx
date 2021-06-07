import React from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';

const sizeOfGrid = 10;

const Grid = styled.div`
  display: grid;
  max-width: 360px;
  grid-template-columns: repeat(${sizeOfGrid}, auto);
  // grid-template-rows: repeat(20, auto);
  // grid-template-columns: repeat(${sizeOfGrid}, calc(360px / ${sizeOfGrid}));
  // grid-template-row: repeat(${sizeOfGrid}, calc(360px / ${sizeOfGrid}));

  // grid-template-columns: repeat(10, auto-fill, minmax(360px, 1fr));
  // grid-template-row: repeat(10, auto-fill, minmax(360px, 1fr));

  background-color: #2196f3;
  border-bottom: 1px solid rgba(255, 255, 255, 1);
  border-left: 1px solid rgba(255, 255, 255, 1);
  line-height: 1;
`;

const GridItem = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  // background-color: #596269;
  box-sizing: border-box;
  border-top: 1px solid rgba(255, 255, 255, 1);
  border-right: 1px solid rgba(255, 255, 255, 1);
  padding: 10px;
  // text-align: center;
  span {
    opacity: 0;
  }
`;

const BoardGame = (props: number[][]) => {
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

export default BoardGame;
