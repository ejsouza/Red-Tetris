import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_TOKEN } from '../config/const';

interface IDecoded {
  userId: string;
  expiresIn: number;
}

const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw 'Invalid token';
    }
    const decodedToken = jwt.verify(token, SECRET_TOKEN) as IDecoded;
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user id';
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      err: new Error('Invalid request'),
    });
  }
};

export { auth };
