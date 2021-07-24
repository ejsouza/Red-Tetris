import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Start from '../components/Start';
import HeadLanding from '../components/HeadLanding';
import Menu from '../components/Menu';
import Game from '../components/Game';
import parseUrlWithHash from '../utils/parseUrlWithHash';
import socket from '../utils/socket';
import { useAppDispatch } from '../store/hooks';
import {
  boardUpdated,
  isHostUpdated,
  levelUpdated,
  scoreUpdated,
  nextUpdated,
  boardShadowsUpdated,
} from '../store/actions';
import { RECRUIT } from '../utils/const';
import { IShadow } from '../interfaces';

interface IRoom {
  id: string;
  name: string;
  open: boolean;
  close: boolean;
  numberPeopleInRoom: number;
  players: Array<string>;
}

interface IResetPlayer {
  board: number[][];
  isHost: boolean;
  level: number;
  score: 0;
}

// /**
//  * REDUCER FUNCTION LOGIC STEPS (reducers must make immutable updates)
//  * ● Check to see if the reducer cares about this action
//  *  ￮ If so, make a copy of the state, update the copy with new values, and return it
//  * ● Otherwise, return the existing state unchanged
//  */

const Index = () => {
  const [startGame, setStartGame] = useState(false);
  const [hideMenu, setHideMenu] = useState(false);
  const [hideStart, setHideStart] = useState(true);
  const [hardness, setHardness] = useState(RECRUIT);
  const [gameName, setGameName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const router = useRouter();
  const url = router.asPath;
  const dispatch = useAppDispatch();

  const infoGame = (socket: SocketIOClient.Socket) => {
    if (gameName && playerName) {
      socket.emit('join', { name: playerName, game: gameName });
    }
  };

  const resetStore = (player: IResetPlayer) => {
    const intialShadows: IShadow[] = [];
    const initialNext: number[] = [];
    dispatch(boardUpdated(player.board));
    dispatch(isHostUpdated(player.isHost));
    dispatch(levelUpdated(player.level));
    dispatch(scoreUpdated(player.score));
    dispatch(nextUpdated(initialNext));
    dispatch(boardShadowsUpdated(intialShadows));
  };

  socket.on('closeStartComponent', () => {
    setHideStart(true);
  });

  socket.on('setGame', () => {
    setStartGame(true);
  });

  useEffect(() => {
    infoGame(socket);
  }, [gameName, playerName]);

  useEffect(() => {
    socket.on('reset', (player: IResetPlayer) => {
      setHideStart(true);
      setStartGame(false);
      setHideMenu(false);
      resetStore(player);
      router.push('/');
      window.location = window.location;
    });

    socket.on('prepare-for-next-game', (player: IResetPlayer) => {
      setStartGame(false);
      setHideStart(false);
      resetStore(player);
    });

    socket.on('set-difficulty', (hardness: number) => {
      setHardness(hardness);
    });
  }, []);

  useEffect(() => {
    if (url?.includes('#')) {
      const [game, player] = parseUrlWithHash(url);
      if (game && player) {
        setGameName(game);
        setPlayerName(player);
        setHideStart(false);
      }

      setHideMenu(true);
    }
    // Detect hash entered on url bar
    window.onhashchange = () => {
      /**
       * Add '/' to the beginnig of the url because when it is entered
       * manually it is not sent like when entering the  form
       */
      const urlEnteredManually = '/' + window.location.hash;
      const [player, game] = parseUrlWithHash(urlEnteredManually);

      if (game && player) {
        setGameName(game);
        setPlayerName(player);
        setHideStart(false);
      }
      setHideMenu(true);
    };
  }, [url]);

  return (
    <Layout title="Home | RedTetris" showNavBar={hideMenu}>
      {!hideMenu && <HeadLanding />}
      {/* Here the idea is to have a menu with some animated tetris */}
      {!hideMenu && <Menu />}
      {!hideStart && <Start gameName={gameName} playerName={playerName} />}
      {startGame && (
        <Game gameName={gameName} playerName={playerName} hardness={hardness} />
      )}
    </Layout>
  );
};

export default Index;
