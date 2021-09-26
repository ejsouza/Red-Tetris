import User from '../models/user';
import { BaseRepository } from './baseRepository';

export default class TokenRepository extends BaseRepository {
  private _user: typeof User;

  constructor() {
    super();
    this._user = User;
  }

  async updateStatus(id: string, update: { status: string }) {
    return this._user.findByIdAndUpdate(id, update);
  }
}
