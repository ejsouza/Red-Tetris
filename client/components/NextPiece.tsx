import { useAppDispatch, useAppSelector } from '../store/hooks';
import { PIECES } from '../../rtAPI/src/utils/const';
import { BOARD_COLORS } from '../utils/const';
import { GridItem } from './InfoGame';
import Loading from './Loading';

const NextPiece = () => {
  const next = useAppSelector((state) => state.next);
  const nextP = PIECES[next[0]];
  const nextPiece: number[][] = Array.from({ length: 2 }, () =>
    Array(10).fill(0)
  );
  if (nextP) {
    nextP.pos.forEach((pos) => {
      if (pos.y < 2) {
        nextPiece[pos.y][pos.x] = nextP.color;
      }
    });
  }

  return !next ? (
    <Loading />
  ) : (
    <>
      {nextPiece.map((row, i) =>
        row.map((cell, index) => (
          <GridItem
            style={{ background: BOARD_COLORS[cell] }}
            key={`shaddy-next-piece-${i}-${index}-${row[i]}-${cell}`}
          >
            <span>{cell}</span>
          </GridItem>
        ))
      )}
    </>
  );
};

export default NextPiece;
