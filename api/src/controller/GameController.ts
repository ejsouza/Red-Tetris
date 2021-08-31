import { RECRUIT, VETERAN, HARDCORE, INSANE } from '../utils/const';

const gameDifficulty = (difficulty: string): number => {
  switch (difficulty) {
    case 'veteran':
      return VETERAN;
    case 'hardcore':
      return HARDCORE;
    case 'insane':
      return INSANE;
    default:
      return RECRUIT;
  }
};

export { gameDifficulty };
