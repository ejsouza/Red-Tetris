import { Router, Request, Response } from 'express';
import PasswordRepository from '../../repositories/passwordRepository';
import PasswordService from '../../services/passwordService';
import { emailCheck, PASS_REGEX } from '../../config/const';

interface IReset {
  email: string;
  password: string;
}

export class PasswordController {
  path = '/password';
  router = Router();
  private _passwordService = new PasswordService(new PasswordRepository());

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
  reset = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = <IReset>req.body;

    /**
     * Check email valid format (also done on the front)
     */
    if (!emailCheck.test(email) || !PASS_REGEX.test(password)) {
      res.status(400).json({
        success: false,
        msg: 'Invalid email format',
      });
      return;
    }

    const response = await this._passwordService.resetPassword({
      email,
      password,
    });

    res.status(response.status).json({
      success: response.success,
      msg: response.msg,
    });
  };
}
