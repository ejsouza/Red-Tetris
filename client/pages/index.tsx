import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import HeadLanding from '../components/HeadLanding';
import Menu from '../components/Menu';
import { getRooms, createGame } from '../core/rooms';
import parseUrlWithHash from '../utils/parseUrlWithHash';

interface IRoom {
  id: string;
  name: string;
  open: boolean;
  close: boolean;
  numberPeopleInRoom: number;
  players: Array<string>;
}

const Index = () => {
  const [hideMenu, setHideMenu] = useState(false);
  const router = useRouter();
  const url = router.asPath;

  useEffect(() => {
    if (url.includes('#')) {
      /**
       * Check if room is available
       *    YES -: preceed to hide menu
       *    NO  -: show message to user and tell s/he to choose another room
       *
       * */

      const [roomName, userName] = parseUrlWithHash(url);
      const room = createGame(roomName, userName);

      setHideMenu(true);
      // /#roomName[userName]
    }
    // Detect hash entered on url bar
    window.onhashchange = () => {
      const urlEnteredManually = window.location.hash;
      console.log(`hash ? ${urlEnteredManually}`);

      console.log(
        `urlEnteredManually: ${parseUrlWithHash(urlEnteredManually)}`
      );
      setHideMenu(true);
    };
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
