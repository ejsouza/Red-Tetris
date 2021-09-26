import User from '../models/user';

export abstract class BaseRepository {
  private _collection: typeof User;

  constructor() {
    this._collection = User;
  }

  async findOne(email: string) {
    return this._collection.findOne({ email });
  }

  async findById(id: string) {
    return this._collection.findById(id);
  }
}
