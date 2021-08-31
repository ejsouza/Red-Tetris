import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NewGame from './NewGame';
import SignUp from './SignUp';
import SignIn from './SignIn';
import { useAppSelector } from '../store/hooks';

const Menu = () => {
  const user = useAppSelector((state) => state.user);
  return (
    <>
      <Container fluid>
        <Row>
          <Col className="text-center">
            <img alt="logo" src="/main_tetris.svg" height="360" width="320" />
          </Col>
        </Row>
        {!user?.success && (
          <Row>
            <Col xs={12} md={6} className="mt-4">
              <SignIn />
            </Col>
            <Col xs={12} md={6} className="mt-4">
              <SignUp />
            </Col>
          </Row>
        )}
        <Row className="mt-4">
          <Col>
            <NewGame />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Menu;
