import { Router, Request, Response, NextFunction } from 'express';

export class VerifyController {
  path = '/verify';
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}?:id`, this.verify);
  }

  verify = async (req: Request, res: Response) => {
    console.log(`Getting here ${req.query.token} -- ${__dirname}`);

    res.sendFile('/verify.html', { root: __dirname });
  };
}
