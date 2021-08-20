import { Router, Request, Response } from 'express';
import User from '../../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendResetPasswordMailToken } from '../../core/email';
import {
  SALT_ROUNDS,
  SECRET_TOKEN,
  emailCheck,
  PASS_REGEX,
} from '../../config/const';

interface IReset {
  email: string;
  password: string;
}

export class PasswordController {
  path = '/password';
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(`${this.path}/reset`, this.reset);
  }

  /**
   * @query
   * email: string
   * new password: string
   * @return
   * 200 ok
   * 401 unauthorized
   * 404 not found
   * 500 server error
   */
  reset = async (req: Request, res: Response) => {
    const { email, password } = <IReset>req.body;

    /**
     * Check email valid format (also done on the front)
     */
    if (!emailCheck.test(email) || !PASS_REGEX.test(password)) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid email format',
      });
    }

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res
            .status(401)
            .json({ success: false, msg: "You don't have permission!" });
        }
        bcrypt.hash(password.toString(), SALT_ROUNDS).then((hash) => {
          const filter = { email };
          const update = {
            password: hash,
            status: 'pending',
          };
          User.findOneAndUpdate(filter, update).then((updated) => {
            if (!updated) {
              return res.status(500).json({
                success: false,
                msg: 'Something went wrong!',
              });
            }
            const token = jwt.sign({ userId: user._id }, SECRET_TOKEN, {
              expiresIn: '1h',
            });
            sendResetPasswordMailToken(
              `${user.firstName} ${user.lastName}`,
              email,
              token
            );
            return res.status(201).json({
              success: true,
              msg: 'Token created, verify your email!',
            });
          });
        });
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          msg: 'An error occurred, try again later!',
          err,
        });
      });
  };
}
