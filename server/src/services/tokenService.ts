import jwt from 'jsonwebtoken';
import TokenRepository from '../repositories/tokenRepository';
import { sendMail } from '../core/email';
import { SECRET_TOKEN } from '../config/const';

export default class TokenService {
  private _userToken: TokenRepository;

  constructor(tokenRepository: TokenRepository) {
    this._userToken = tokenRepository;
  }

  async verify(token: string, id: string) {
    try {
      const payload = {
        status: 'verified',
      };
      jwt.verify(token, SECRET_TOKEN);
      await this._userToken.updateStatus(id, payload);

      return {
        status: 200,
        path: '../../views/tokenVerified.html',
      };
    } catch (err) {
      return {
        status: 401,
        path: '../../views/tokenExpired.html',
      };
    }
  }

  async create(email: string) {
    const user = await this._userToken.findOne(email);
    if (!user) {
      return {
        success: false,
        status: 404,
        msg: 'User not found!',
      };
    }
    if (user.status === 'verified') {
      return {
        success: true,
        status: 200,
        msg: 'This account is already verified!',
      };
    }
    try {
      const token = jwt.sign({ userId: user?._id }, SECRET_TOKEN, {
        expiresIn: '24h',
      });
      sendMail(email, token);
      return {
        success: true,
        status: 201,
        msg: 'Token created, verify your email!',
      };
    } catch (err) {
      return {
        success: false,
        status: 404,
        msg: 'User not found!',
      };
    }
  }
}
