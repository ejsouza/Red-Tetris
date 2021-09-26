import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/user';
import { sendMail } from '../../core/email';
import { SALT_ROUNDS, SECRET_TOKEN, emailCheck } from '../../config/const';
import AuthService from '../../services/authService';
import AuthRepository from '../../repositories/authRepository';

interface IUser {
  email: string;
  password: string;
}

export interface ResponseInterface extends IUser {
  status: number;
  success: boolean;
  msg: string;
}

export class AuthController {
  public path = '/auth';
  public router = Router();
  private _authService = new AuthService(new AuthRepository());
  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(`${this.path}/signup`, this.signup);
    this.router.post(`${this.path}/signin`, this.signin);
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
    const { email, password } = <IUser>req.body;
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
        msg: 'Password should be at least eight characters long',
      });
      return;
    }

    const response = await this._authService.create({ email, password });
    if (response.success) {
      const user = await this._authService.getUserByEmail(email);
      const token = jwt.sign({ userId: user?._id }, SECRET_TOKEN, {
        expiresIn: '24h',
      });
      sendMail(email, token);
    }
    res.status(response.status).json({
      success: response.success,
      msg: response.msg,
    });

    /* Check if user already exists */
    // User.findOne({ email }).then((user) => {
    //   console.log(`\nWHAT HERE ?\n`);
    //   if (user) {
    //     return res.status(400).json({
    //       success: false,
    //       msg: `This email is already in use!`,
    //     });
    //   } else {
    //     /* Hash password before saving to db */
    //     console.log(`\n1..........>>\n`);
    //     bcrypt
    //       .hash(password.toString(), SALT_ROUNDS)
    //       .then((hash) => {
    //         console.log(`\n2..........>>\n`);

    //         /* Create user after hashing  password */
    //         const user = new User({
    //           email,
    //           password: hash,
    //         });
    //         console.log(`\n3..........>>\n`);

    //         /* Save new user to db */
    //         user.save().then(() => {
    //           // send email
    //           console.log(`\n4..........>>\n`);

    //           const token = jwt.sign({ userId: user._id }, SECRET_TOKEN, {
    //             expiresIn: '24h',
    //           });
    //           sendMail(email, token);
    //           console.log(`\nBefore returning ? \n`);
    //           return res
    //             .status(201)
    //             .json({ success: true, msg: 'User created successfully' });
    //         });
    //       })
    //       .catch((err) => {
    //         console.log(`CATCH CATCH`);
    //         res.status(500).json({ success: false, err });
    //       });
    //   }
    //   console.log('Leaving class >>>>');
    // }).catch((err) => {
    //   console.log(`SHOULD NOT COME HERE ${err}`);
    // })
  };

  signin = async (req: Request, res: Response): Promise<void> => {
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

    const response = await this._authService.login({ email, password });
    res.setHeader(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    res.status(response.status).json({
      success: response.success,
      token: response.token,
      id: response.id,
      err: response.err,
    });

    // User.findOne({ email })
    //   .then((user) => {
    //     if (!user) {
    //       return res.status(401).json({
    //         success: false,
    //         err: 'User not found',
    //       });
    //     }
    //     if (user.status === 'pending') {
    //       return res.status(403).json({
    //         success: false,
    //         err: 'Please confirm your account first before login, we sent you an email confirmation, check your inbox!',
    //       });
    //     }
    //     /* If we get here user was found, check passworkd */
    //     bcrypt.compare(password, user.password).then((valid) => {
    //       if (!valid) {
    //         return res.status(401).json({
    //           success: false,
    //           err: `Incorrect password`,
    //         });
    //       }
    //       /* If we get here send token and user id */
    //       const token = jwt.sign({ userId: user._id }, SECRET_TOKEN, {
    //         expiresIn: 1000,
    //       });
    //       res.setHeader(
    //         'Access-Control-Allow-Headers',
    //         'x-access-token, Origin, Content-Type, Accept'
    //       );
    //       return res.status(200).json({
    //         success: true,
    //         id: user?._id,
    //         token,
    //       });
    //     });
    //   })
    //   .catch((err) => {
    //     res.status(500).json({
    //       success: false,
    //       err,
    //     });
    //   });
  };

  // delete = async (req: Request, res: Response): Promise<void> => {
  //   const email: string = req.body.email;
  //   console.log(`deleting... ${email}`);
  //   User.findOneAndDelete({ email })
  //     .then((deleted) => {
  //       if (!deleted) {
  //         res.status(401).json({
  //           success: false,
  //           err: new Error('User not found'),
  //         });
  //         return;
  //       }

  //       res.status(200).json({
  //         success: true,
  //         userid: deleted._id,
  //       });
  //     })
  //     .catch((err) => {
  //       res.status(500).json({
  //         success: false,
  //         err,
  //       });
  //     });
  // };
}
