import React from 'react';
import { Header } from './components/header';
import { Main } from './components/main';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import styled, { DefaultTheme } from 'styled-components';

const Test = styled.div`
  text-align: center;
`

const App: React.FC = () => {
  return (
   <>
      <Header />
      <Jumbotron>
        <Container>
          <h1 className="display-2 text-center">Welcome to <span className="bg-danger text-white">Red</span>Tetris</h1>
          </Container>
        </Jumbotron>
        <Main />

   </>
  );
}

export default App;
