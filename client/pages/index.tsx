import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import HeadLanding from '../components/HeadLanding';
import Menu from '../components/Menu';
import { getRooms, createGame } from '../core/createGame';

interface IRoom {
  id: string;
  name: string;
  open: boolean;
  close: boolean;
  numberPeopleInRoom: number;
  players: Array<string>;
}

const IndexPage = () => {
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
      createGame(url);
      setHideMenu(true);
      console.log(`Home page -: ${url}`);
    }
    // Detect hash entered on url bar
    window.onhashchange = () => {
      console.log(`hash ? ${url}`);
      setHideMenu(true);
    };
  }, [url]);

  getRooms().then((res: IRoom) => {
    console.log(typeof res);
    console.log(res);

    const { rooms } = res;
    rooms.map((room: IRoom) => {
      console.log(room);
    });
  });
  return (
    <Layout title="Home | RedTetris" showNavBar={hideMenu}>
      {!hideMenu && <HeadLanding />}
      {/* Here the idea is to have a menu with some animated tetris */}
      {!hideMenu && <Menu />}
    </Layout>
  );
};

export default IndexPage;
