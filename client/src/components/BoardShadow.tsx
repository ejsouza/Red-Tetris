import { BOARD_HEIGHT, BOARD_WIDTH, SHADOW_COLORS } from '../utils/const';
import Col from 'react-bootstrap/Col';
import { useAppSelector } from '../store/hooks';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${BOARD_WIDTH}, 1fr);
  border-bottom: 1px solid rgba(255, 255, 255, 1);
  border-left: 1px solid rgba(255, 255, 255, 1);
  line-height: 1;
  max-height: 270px;
  max-width: 130px;
`;

const GridItem = styled.div`
  max-height: 5px;
  max-width: 5px;
  border-top: 1px solid rgba(255, 255, 255, 1);
  border-right: 1px solid rgba(255, 255, 255, 1);
  padding: 6px;
  span {
    opacity: 0;
  }
`;

const BoardShadow = (): JSX.Element => {
  const playersBoard = useAppSelector((state) => state.shadows);
  let foo = 0;
  playersBoard.forEach((player) => {
    for (let row = 2; row < BOARD_HEIGHT; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        if (player.board[row][col] !== 0) {
          const color = player.board[row][col];
          player.board[row][col] = 9;
          col++;
          while (col < BOARD_WIDTH && player.board[row][col] === color) {
            player.board[row][col] = 0;
            col++;
          }
        }
      }
    }
  });
  const board = playersBoard.map((player, index) => {
    return (
      <div key={`outer-key${player.player}-${index}`}>
        <Col key={`col-${player.player}--${index}--${foo}`}>
          {
            <Grid key={`grid-${player.player}--${index}-${foo}`}>
              {player.board.slice(2).map((row, rowIndex) => {
                return row.map((cell, cellIndex) => {
                  return (
                    <GridItem
                      style={{ background: SHADOW_COLORS[cell] }}
                      key={`grid-cell-${index}-${rowIndex}-${
                        player.player
                      }-${cellIndex}-${foo++}`}
                    >
                      <span>{cell}</span>
                    </GridItem>
                  );
                });
              })}
            </Grid>
          }
        </Col>
      </div>
    );
  });
  return <>{board}</>;
};

export default BoardShadow;
