import { APIurl, BOARD_HEIGHT } from '../utils/const';

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
};

export const creatNewGame: (
  name: string,
  player: string
) => Promise<Response> = async (name: string, player: string) => {
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
  if (result.success && result.game.open) {
    // Game exist, check if is open
    console.log('Players ?', result.game.players);
    const userNameTaken = result.game.players.find((p: string) => p === player);
    if (!userNameTaken) {
      // Add user to the game
      const res = await addUserToGame(name, player);
      const game = await res.json();
      console.log(`User added to game ? ${game.msg}`);
    } else {
      // return message saying username already in use in this room
      return { success: false, msg: `Username '${player}' already in use` };
    }
    console.log(`User name already taken ? ${userNameTaken}`);
  } else {
    // return message tell user to choose another game name
    return {
      success: false,
      msg: `Game '${name}' is not available, please choose another one`,
    };
  }
};

export const addUserToGame = async (
  game: string,
  player: string
): Promise<Response> => {
  console.log(`addUserToGame game := ${game} user :=  ${player}`);
  return await fetch(`${APIurl}/games`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      game,
      player,
    }),
  });
};
