import { APIurl } from '../utils/const';

interface IGame {
  name: string;
  open: boolean;
  over: boolean;
  maxPlayers: number;
  players: string[];
}

export const getGameByName = async (name: string): Promise<Response> => {
  return await fetch(`${APIurl}/games/${name}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  // return games.json();
};

export const creatNewGame: (
  name: string,
  player: string
) => Promise<void> = async (name: string, player: string) => {
  const game = await getGameByName(name);
  const result = await game.json();
  if (!result.success) {
    // Game doesn't exist, precede for creationg
    return await fetch(`${APIurl}/games`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        players: [player],
        open: true,
      }),
    })
      .then((res) => res.json())
      .then((json) => json);
  }
  if (result.success) {
    // Game exist, check if is open
    if (result.game.open) {
      console.log('Players ?', result.game.players);
      const userNameTaken = result.game.players.find(
        (p: string) => p === player
      );
      if (!userNameTaken) {
        // Add user to the game
      } else {
        // return message saying username already in use in this room
      }
      console.log(`User name already taken ? ${userNameTaken}`);
    } else {
      // return message tell user to choose another game name
    }
    console.log(`game := ${result.game.open}`);
  }
  // return gameAlreadyExist;
};
