import User from '../models/user';
import { BaseRepository } from './baseRepository';

export default class UserRepository extends BaseRepository {
  private _user: typeof User;

  constructor() {
    super();
    this._user = User;
  }

  async update(
    id: string,
    update: {
      firstName: string;
      lastName: string;
    }
  ) {
    const updated = await this._user.findOneAndUpdate({ _id: id }, update, {
      new: true,
    });
    console.log(updated);
    return updated;
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
    return this._user.findOneAndUpdate({ _id: id }, update, { new: true });
  }
}
