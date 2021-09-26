import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import PasswordRepository from '../repositories/passwordRepository';
import { UserInterface } from '../repositories/authRepository';
import { sendResetPasswordMailToken } from '../core/email';
import { SALT_ROUNDS, SECRET_TOKEN } from '../config/const';

export default class PasswordService {
  private _userPassword: PasswordRepository;

  constructor(passwordRepository: PasswordRepository) {
    this._userPassword = passwordRepository;
  }

  async resetPassword({ email, password }: UserInterface) {
    const user = await this._userPassword.findOne(email);

    if (!user) {
      return {
        success: false,
        status: 401,
        msg: "You don't have permission!",
      };
    }

    const hash = await bcrypt.hash(password.toString(), SALT_ROUNDS);
    const filter = { email };
    const payload = {
      password: hash,
      status: 'pending',
    };

    try {
      this._userPassword.resetPassword(filter, payload);
      const token = jwt.sign({ userId: user._id }, SECRET_TOKEN, {
        expiresIn: '1h',
      });
      sendResetPasswordMailToken(
        `${user.firstName} ${user.lastName}`,
        email,
        token
      );
      return {
        success: true,
        status: 201,
        msg: 'Token created, verify your email!',
      };
    } catch (err) {
      return {
        success: false,
        status: 500,
        msg: 'Something went wrong.',
      };
    }
  }
}
