import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthRepository, { UserInterface } from '../repositories/authRepository';
import { SALT_ROUNDS, SECRET_TOKEN, emailCheck } from '../config/const';

export default class AuthService {
  private _user: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this._user = authRepository;
  }

  async create(user: UserInterface) {
    const exists = await this._user.findOne(user.email);
    if (exists) {
      return {
        success: false,
        status: 400,
        msg: 'Email already in use',
      };
    }
    try {
      const hash = await bcrypt.hash(user.password.toString(), SALT_ROUNDS);
      user.password = hash;
      const response = await this._user.create(user);
      return {
        success: true,
        status: 201,
        msg: 'User created successfully',
      };
    } catch (err) {
      return {
        success: false,
        status: 500,
        msg: 'Something went wrong.',
      };
    }
  }

  async login({ email, password }: UserInterface) {
    const user = await this._user.findOne(email);
    if (!user) {
      return {
        success: false,
        status: 401,
        token: '',
        id: '',
        err: 'User not found',
      };
    }
    if (user.status === 'pending') {
      return {
        success: false,
        status: 403,
        token: '',
        id: '',
        err: 'Please confirm your account first before login, we sent you an email confirmation, check your inbox!',
      };
    }

    const authentication = await bcrypt.compare(password, user.password);
    if (!authentication) {
      return {
        success: false,
        status: 401,
        token: '',
        id: '',
        err: 'Incorrect email/password',
      };
    }

    const token = jwt.sign({ userId: user._id }, SECRET_TOKEN, {
      expiresIn: '24h',
    });

    return {
      success: true,
      status: 200,
      token,
      id: user._id,
      err: '',
    };
  }

  async getUserByEmail(email: string) {
    return this._user.findOne(email);
  }
}
