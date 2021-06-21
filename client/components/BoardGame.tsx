import React from 'react';
import { useSelector } from 'react-redux';
import { useAppSelector } from '../store/hooks';
import styled, { createGlobalStyle, css } from 'styled-components';

const sizeOfGrid = 10;

const Grid = styled.div`
  display: grid;
  // width: 100%;
  // max-width: 360px;
  // max-height: 800vh;
  grid-template-columns: repeat(${sizeOfGrid}, 1fr);
  // grid-template-columns: repeat(${sizeOfGrid}, minmax(10px, 1fr));
  // grid-template-rows: repeat(20, 1fr);
  // grid-template-columns: repeat(${sizeOfGrid}, calc(360px / ${sizeOfGrid}));
  // grid-template-row: repeat(${sizeOfGrid}, calc(360px / ${sizeOfGrid}));

  // grid-template-columns: repeat(10, auto-fill, minmax(360px, 1fr));
  // grid-template-row: repeat(10, auto-fill, minmax(360px, 1fr));

  background-color: #2196f3;
  border-bottom: 1px solid rgba(255, 255, 255, 1);
  border-left: 1px solid rgba(255, 255, 255, 1);
  // gap 1px 1px;
  line-height: 1;
`;

const GridItem = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  // max-height: 2vh;
  // max-width: 2vw;
  // background-color: #596269;
  // box-sizing: border-box;
  border-top: 1px solid rgba(255, 255, 255, 1);
  border-right: 1px solid rgba(255, 255, 255, 1);
  padding: 10px;
  // text-align: center;
  span {
    opacity: 0;
  }
`;


interface IProps {
  b: number[][];
}

const BoardGame = (props: IProps) => {
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

  // const b: number[][] = useSelector((state) => state.board);
  const b = useAppSelector((state) => state.board);
  console.log(`BoardGame := ${b} - ${typeof b}`);
  // console.table(props);
  const board = Object.entries(props.b).map((row) => {
    return row[1].map((cell) => (
      <GridItem style={{ background: colors[cell] }} key={`cell-${index++}`}>
        <span>{cell}</span>
      </GridItem>
    ));
  });

  return <Grid>{board}</Grid>;
};

export default BoardGame;
