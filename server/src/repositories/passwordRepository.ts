import User from '../models/user';
import { BaseRepository } from './baseRepository';

export interface UserInterface {
  email: string;
  password: string;
}

export default class PasswordRepository extends BaseRepository {
  private _user: typeof User;

  constructor() {
    super();
    this._user = User;
  }

  async resetPassword(
    filter: { email: string },
    payload: { password: string; status: string }
  ) {
    return this._user.findOneAndUpdate(filter, payload);
  }
}
