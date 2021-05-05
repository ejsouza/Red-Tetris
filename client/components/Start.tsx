import React, { FC, ReactElement, useEffect, useState } from 'react';
import Loading from './Loading';
import { getGameByName } from '../core/games';

interface IStartProps {
  gameName: string;
}

interface IGame {
  name: string;
  open: boolean;
  over: boolean;
  maxPlayers: number;
  players: string[];
}

const Start = ({ gameName }: IStartProps): JSX.Element => {
  const [game, setGame] = useState<IGame>();

  getGameByName(gameName).then((res) => {
    console.log(`GAME := ${res.game}`);
  });

  return !game ? (
    <Loading />
  ) : (
    <>
      <div>Start {gameName}</div>
    </>
  );
};

export default Start;
