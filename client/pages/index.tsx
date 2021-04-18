import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';
import Layout from '../components/Layout';

import HeadLanding from '../components/HeadLanding';
import Menu from '../components/Menu';
import { getRooms, createGame } from '../core/rooms';
import parseUrlWithHash from '../utils/parseUrlWithHash';
import { APIurl, BASEurl } from '../utils/const';

interface IRoom {
  id: string;
  name: string;
  open: boolean;
  close: boolean;
  numberPeopleInRoom: number;
  players: Array<string>;
}

let socket;

const Index = () => {
  const [hideMenu, setHideMenu] = useState(false);
  const router = useRouter();
  const url = router.asPath;
  const reg = /^#+[a-z]+[a-z0-9]{3,}\[[a-z]+[a-z0-9]{4,}\]/gi;

  useEffect(() => {
    socket = io(BASEurl, {
      query: {
        x: 42,
      },
    });
    socket.emit('join', { name: 'username', room: 'roomname' });
    console.log(socket);
  }, []);
  useEffect(() => {
    if (url.includes('#')) {
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
      const urlEnteredManually = window.location.hash;
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
    </Layout>
  );
};

export default Index;
