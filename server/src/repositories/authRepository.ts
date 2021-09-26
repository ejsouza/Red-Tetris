import User from '../models/user';
import { BaseRepository } from './baseRepository';

export interface UserInterface {
  email: string;
  password: string;
}

export default class AuthRepository extends BaseRepository {
  private _user: typeof User;

  constructor() {
    super();
    this._user = User;
  }

  async create(user: UserInterface) {
    return this._user.create(user);
  }
}
