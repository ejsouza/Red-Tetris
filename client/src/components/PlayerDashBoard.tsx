import { useAppSelector } from '../store/hooks';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const PlayerDashBoard = () => {
  const score = useAppSelector((state) => state.score);
  const level = useAppSelector((state) => state.level);

  return (
    <>
      <Row className="dashboard">
        <Col>Next Piece</Col>
        <Col>Level: {level}</Col>
        <Col>Score: {score}</Col>
      </Row>
    </>
  );
};

export default PlayerDashBoard;
