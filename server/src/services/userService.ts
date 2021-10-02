import UserRepository from '../repositories/userRepository';

export default class UserService {
  private _user: UserRepository;

  constructor(userRepository: UserRepository) {
    this._user = userRepository;
  }

  async profile(id: string) {
    const data = await this._user.findById(id);

    const user = {
      firstName: data?.firstName,
      lastName: data?.lastName,
      bestScore: data?.bestScore,
      bestLevel: data?.bestLevel,
      playedGames: data?.playedGames,
      victory: data?.victory,
      defeat: data?.defeat,
      createdAt: data?.createdAt,
      updatedAt: data?.updatedAt,
    };
    return {
      success: true,
      status: 200,
      user,
      msg: '',
    };
  }

  async update(
    id: string,
    update: {
      firstName: string;
      lastName: string;
    }
  ) {
    const data = await this._user.update(id, update);

    const user = {
      firstName: data?.firstName,
      lastName: data?.lastName,
      bestScore: data?.bestScore,
      bestLevel: data?.bestLevel,
      playedGames: data?.playedGames,
      victory: data?.victory,
      defeat: data?.defeat,
      createdAt: data?.createdAt,
      updatedAt: data?.updatedAt,
    };

    return {
      success: true,
      status: 201,
      user,
      msg: 'User Updated successfull',
    };
  }

  async score(
    id: string,
    update: {
      playedGames: number;
      victory: number;
      defeat: number;
      bestScore: number;
      bestLevel: number;
    }
  ) {
    const data = await this._user.score(id, update);

    return {
      success: true,
      status: 200,
      updated: data,
      msg: 'Score Updated successfull',
    };
  }
}
