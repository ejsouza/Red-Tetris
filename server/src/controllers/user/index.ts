import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/user';
import { auth } from '../../middleware/auth';
import { sendMail } from '../../core/email';
import { SALT_ROUNDS, SECRET_TOKEN } from '../../config/const';

interface IUser {
  email: string;
  password: string;
}

export class UserController {
  public path = '/auth';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(`${this.path}/signup`, this.signup);
    this.router.post(`${this.path}/login`, this.login);
    this.router.post(`${this.path}/logout`, this.logout);
    this.router.delete(`${this.path}/delete`, this.delete);
    // how to use the middle ware to check logged in users
    // this.router.post(`${this.path}/logout`, auth, this.logout);
  }

  signup = async (req: Request, res: Response): Promise<void> => {
    /**
     * @param
     * email: string
     * password: string
     * @return
     * 201 created
     * 400 bad request
     * 500 server error
     */

    const emailCheck =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    const { password, email } = <IUser>req.body;

    console.log(`called with email: ${email} and password ${password}`);
    if (!emailCheck.test(email)) {
      res.status(400).json({
        success: false,
        msg: 'Invalid email format',
      });
      return;
    }
    if (password.trim().length < 8) {
      res.status(400).json({
        success: false,
        msg: 'Password should be at least six characters long',
      });
      return;
    }

    /* Hash password before saving to db */
    bcrypt
      .hash(password.toString(), SALT_ROUNDS)
      .then((hash) => {
        /* Create user after hashing  password */
        const user = new User({
          email,
          password: hash,
        });
        /* Save new user to db */
        user
          .save()
          .then(() => {
            // send email
            const token = jwt.sign({ userId: user._id }, SECRET_TOKEN, {
              expiresIn: '24h',
            });
            sendMail(email, token);
            res
              .status(201)
              .json({ success: true, msg: 'User created successfully' });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ success: false, err });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ success: false, err });
      });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    /**
     * @param
     * email: string
     * password: string
     * @return
     * 200 authentication successfully
     * 	{
     * 		userId,
     * 		token
     * 	}
     * 401 authentication failed
     */
    const { password, email } = <IUser>req.body;

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          res.status(401).json({
            success: false,
            err: new Error('User not found'),
          });
          return;
        }
        /* If we get here user was found, check passworkd */
        bcrypt
          .compare(password, user.password)
          .then((valid) => {
            if (!valid) {
              res.status(401).json({
                success: false,
                /* To access the error on the front use err.message */
                err: new Error(`Incorrect password`),
              });
              return;
            }
            /* If we get here send token and user id */
            const token = jwt.sign({ userId: user._id }, SECRET_TOKEN, {
              expiresIn: 500,
            });
            res.status(200).json({
              success: true,
              userid: user?._id,
              token,
            });
          })
          .catch((err) => {
            res.status(500).json({
              success: false,
              err,
            });
          });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          err,
        });
      });
  };
  logout = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ success: true, msg: 'logout' });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const email: string = req.body.email;
    console.log(`deleting... ${email}`);
    User.findOneAndDelete({ email })
      .then((deleted) => {
        if (!deleted) {
          res.status(401).json({
            success: false,
            err: new Error('User not found'),
          });
          return;
        }

        res.status(200).json({
          success: true,
          userid: deleted._id,
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
