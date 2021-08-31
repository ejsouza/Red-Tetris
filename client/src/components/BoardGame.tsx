import React from 'react';
import { useAppSelector } from '../store/hooks';
import { BOARD_COLORS, BOARD_WIDTH } from '../utils/const';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${BOARD_WIDTH}, 1fr);
  line-height: 1;
  height: 80vh;
  width: 360px;
  background-color: hsla(200, 40%, 30%, 0.4);
  background-image: url('/dark-forest.png'), url('/forest.png'),
    url('/space.jpeg'), url('/space.jpeg'), url('/space.jpeg');
  background-repeat: repeat-x;
  background-position: 0 20%, 0 100%, 0 50%, 0 100%, 0 0;
  background-size: 2500px, 800px, 500px 200px, 1000px, 400px 260px;
  animation: 50s para infinite linear;

  @keyframes para {
    100% {
      background-position: -1000px 20%, -800px 95%, 500px 50%, 1000px 100%,
        400px 0;
    }
  }
`;

const GridItem = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 1);
  border-right: 1px solid rgba(255, 255, 255, 1);
  padding: 10px;
  span {
    opacity: 0;
  }
`;

const Container = styled.div`
  height: 96.7vh;
`;

const BoardGame = () => {
  let index = 0;
  const boardState = useAppSelector((state) => state.board);
  return (
    <Container>
      <Grid>
        {boardState.slice(2).map((row) => {
          return row.map((cell) => (
            <GridItem
              style={{ background: BOARD_COLORS[cell] }}
              key={`cell-${index++}`}
            >
              <span>{cell}</span>
            </GridItem>
          ));
        })}
      </Grid>
    </Container>
  );
};

export default BoardGame;
