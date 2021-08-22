import { Router, Request, Response, NextFunction } from 'express';
import User from '../../models/user';
import path from 'path';
import jwt from 'jsonwebtoken';
import { sendMail } from '../../core/email';
import { SECRET_TOKEN } from '../../config/const';

export class TokenController {
  path = '/token';
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}/verify?:id`, this.verify);
    this.router.post(`${this.path}/create`, this.create);
  }

  /**
   * @query
   * token: string
   * @return
   * view (Verified | Expired)
   * 401 unauthorized
   * 404 not found
   * 500 server error
   */
  verify = async (req: Request, res: Response) => {
    const tokenBase64 = req.query.token;

    if (tokenBase64 === undefined) {
      return res.status(401).json({ success: false, err: 'Unauthorized' });
    } else {
      const token: any = jwt.decode(tokenBase64.toString());

      const id = token.userId as string;

      User.findById({ _id: id })
        .then((user) => {
          if (!user) {
            return res
              .status(404)
              .json({ success: false, err: 'User not found' });
          }
          jwt.verify(tokenBase64.toString(), SECRET_TOKEN, (err, decoded) => {
            if (err) {
              if (err.name === 'TokenExpiredError') {
                return res
                  .status(401)
                  .sendFile(
                    path.join(__dirname, '../../views/tokenExpired.html')
                  );
              }
            } else if (decoded) {
              user.status = 'verified';
              user.save().then((updated) => {
                if (updated) {
                  return res
                    .status(200)
                    .sendFile(
                      path.join(__dirname, '../../views/tokenVerified.html')
                    );
                }
              });
            }
          });
        })
        .catch((err) => {
          return res.status(401).json({ success: false, err: 'Unauthorized' });
        });
    }
  };

  /**
   * @param
   * email: string
   * @return
   * 200 ok (token already verified)
   * 201 created
   * 401 not found
   * 500 server error
   */
  create = async (req: Request, res: Response) => {
    const email: string = req.body.email;
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            success: false,
            msg: 'User not found!',
          });
        }
        if (user.status === 'verified') {
          return res.status(200).json({
            success: true,
            msg: 'This account is already verified!',
          });
        }
        const token = jwt.sign({ userId: user._id }, SECRET_TOKEN, {
          expiresIn: '24h',
        });
        sendMail(email, token);
        return res.status(201).json({
          success: true,
          msg: 'Token created, verify your email!',
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          err,
        });
      });
  };
}
