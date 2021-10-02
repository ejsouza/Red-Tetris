import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { sendMail } from '../../core/email';
import { SECRET_TOKEN, emailCheck } from '../../config/const';
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
  };
}
