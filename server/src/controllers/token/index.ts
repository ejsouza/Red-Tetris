import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import TokenRepository from '../../repositories/tokenRepository';
import TokenService from '../../services/tokenService';

export class TokenController {
  path = '/token';
  router = Router();
  private _tokenService = new TokenService(new TokenRepository());

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
  verify = async (req: Request, res: Response): Promise<void> => {
    const tokenBase64 = req.query.token;
    const tokenRepository = new TokenRepository();

    if (tokenBase64 === undefined) {
      res.status(401).json({ success: false, err: 'Unauthorized' });
      return;
    }
    const token: any = jwt.decode(tokenBase64.toString());
    const id = token?.userId as string;
    const user = await tokenRepository.findById(id);
    if (!user) {
      res
        .status(401)
        .json({ success: false, err: "You don't have permission!" });
      return;
    }
    const response = await this._tokenService.verify(
      tokenBase64.toString(),
      id
    );

    res.status(response.status).sendFile(path.join(__dirname, response.path));
    return;
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

    const response = await this._tokenService.create(email);

    res.status(response.status).json({
      success: response.success,
      msg: response.msg,
    });
  };
}
