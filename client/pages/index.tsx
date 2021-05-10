import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';
import Layout from '../components/Layout';
import Start from '../components/Start';
import HeadLanding from '../components/HeadLanding';
import Menu from '../components/Menu';
import Game from '../components/Game';
import { getRooms, createGame } from '../core/rooms';
import parseUrlWithHash from '../utils/parseUrlWithHash';
import socket from '../utils/socket';

interface IRoom {
  id: string;
  name: string;
  open: boolean;
  close: boolean;
  numberPeopleInRoom: number;
  players: Array<string>;
}



const Index = () => {

  const [startGame, setStartGame] = useState(false);
  const [hideMenu, setHideMenu] = useState(false);
  const [hideStart, setHideStart] = useState(true);
  const [gameName, setGameName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const router = useRouter();
  const url = router.asPath;
  const reg = /^#+[a-z]+[a-z0-9]{3,}\[[a-z]+[a-z0-9]{4,}\]/gi;

  const infoGame = (socket: SocketIOClient.Socket) => {
    if (gameName && playerName) {
      socket.emit('join', { name: playerName, game: gameName });
    }
  };

  socket.on('closeStartComponent', () => {
    setHideStart(true);
  })

  socket.on('setGame', () => {
    setStartGame(true);
  })
  useEffect(() => {
    infoGame(socket);   
  }, [gameName, playerName]);
  useEffect(() => {
    if (url?.includes('#')) {
      const [game, player] = parseUrlWithHash(url);
      if (game && player) {
        console.log(`Toggle`);
        setGameName(game);
        setPlayerName(player);
        setHideStart(false);;
      }

      /**
       * Check if room is available
       *    YES -: preceed to hide menu
       *    NO  -: show message to user and tell s/he to choose another room
       *
       * */

      /**
       * Use reg.test(url) here to check if it is right formated
       * before preceding.
       */

      // remove leading '/' from url before testing
      if (reg.test(url.slice(1))) {
        console.log(`URL FORMAT RIGHT ${url}`);
      } else {
        console.log(`URL WRONG FORMAT  ${url}`);
      }
      const [roomName, userName] = parseUrlWithHash(url);
      const room = createGame(roomName, userName);

      setHideMenu(true);
      // /#roomName[userName]
      console.log(`url.includes(#)`);
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

      console.log(`GOT IT ? ${game} - ${player}`);
      if (reg.test(urlEnteredManually)) {
        alert(`YOU MAY PASS \n ${urlEnteredManually}`);
      }
      console.log(`TESTING REGEX =: ${reg.test(urlEnteredManually)}`);
      console.log(`hash ? ${urlEnteredManually}`);

      console.log(
        `urlEnteredManually: ${parseUrlWithHash(urlEnteredManually)}`
      );
      setHideMenu(true);
    };
    console.log(`url =: ${url}`);
  }, [url]);

  return (
    <Layout title="Home | RedTetris" showNavBar={hideMenu}>
      {!hideMenu && <HeadLanding />}
      {/* Here the idea is to have a menu with some animated tetris */}
      {!hideMenu && <Menu />}
      {!hideStart && <Start gameName={gameName} playerName={playerName} />}
      {startGame && <Game />}
    </Layout>
  );
};

export default Index;
