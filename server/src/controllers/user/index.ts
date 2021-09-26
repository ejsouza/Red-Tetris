import { Router, Request, Response, NextFunction } from 'express';
import { auth } from '../../middleware/auth';
import User from '../../models/user';
import UserRepository from '../../repositories/userRepository';
import UserService from '../../services/userService';

interface IUserInfo {
  firstName: string;
  lastName: string;
}

interface IScore {
  level: number;
  score: number;
  defeat: number;
  playedGames: number;
  victory: number;
}

export class UserController {
  public path = '/users';
  public router = Router();
  private _userService = new UserService(new UserRepository());

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}/:id`, auth, this.profile);
    this.router.patch(`${this.path}/:id`, auth, this.update);
    this.router.post(`${this.path}/:id`, auth, this.score);
  }

  /**
   * @param
   * email: string
   * password: string
   * @return
   * 201 created
   * 400 bad request
   * 500 server error
   */
  profile = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    if (!id) {
      res.status(404).json({
        success: false,
        user: {},
        msg: 'User not found',
      });
      return;
    }

    const response = await this._userService.profile(id);

    res.status(response.status).json({
      success: response.success,
      user: response.user,
      msg: response.msg,
    });

    // User.findById({ _id: id })
    //   .then((user) => {
    //     console.log(`gets here bitch ? ${user}`);
    //     res.status(200).json({
    //       success: true,
    //       user: {
    //         firstName: user?.firstName,
    //         lastName: user?.lastName,
    //         bestScore: user?.bestScore,
    //         bestLevel: user?.bestLevel,
    //         playedGames: user?.playedGames,
    //         victory: user?.victory,
    //         defeat: user?.defeat,
    //         createdAt: user?.createdAt,
    //         updatedAt: user?.updatedAt,
    //       },
    //     });
    //     return;
    //     console.log(`NEVER  gets here bitch ? ${user}`);
    //   })
    //   .catch((err) => {
    //     console.log(`profile() catch(err)`);

    //     res.status(404).json({ success: false, msg: 'User not found' });
    //     return;
    //   });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    const { firstName, lastName } = <IUserInfo>req.body;

    if (firstName.length < 3 || lastName.length < 3) {
      res.status(400).json({
        success: false,
        msg: `Your first and last name should be at least four characters long!`,
      });
      return;
    }

    const update = {
      firstName,
      lastName,
    };

    const response = await this._userService.update(id, update);

    res.status(response.status).json({
      success: response.success,
      user: response.user,
      msg: response.msg,
    });

    // User.findOneAndUpdate(filter, update, { new: true }).then((updated) => {
    //   if (!updated) {
    //     return res.status(500).json({
    //       success: false,
    //       msg: 'Something went wrong!',
    //     });
    //   }
    //   return res.status(201).json({
    //     success: true,
    //     msg: 'User Updated successfull',
    //     user: {
    //       firstName: updated?.firstName,
    //       lastName: updated?.lastName,
    //       bestScore: updated?.bestScore,
    //       bestLevel: updated?.bestLevel,
    //       playedGames: updated?.playedGames,
    //       createdAt: updated?.createdAt,
    //       updatedAt: updated?.updatedAt,
    //     },
    //   });
    // });
  };

  score = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { level, score, defeat, playedGames, victory } = req.body as IScore;
    const userRepository = new UserRepository();
    const user = await userRepository.findById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        updated: {},
        msg: 'User not found',
      });
      return;
    }

    const update = {
      playedGames: user.playedGames + 1,
      victory: user.victory + victory,
      defeat: user.defeat + defeat,
      bestScore: user.bestScore > score ? user.bestScore : score,
      bestLevel: user.bestLevel > level ? user.bestLevel : level,
    };

    const response = await this._userService.score(id, update);

    res.status(response.status).json({
      success: response.success,
      updated: response.updated,
      msg: response.msg,
    });

    // User.findById({ _id: id })
    //   .then((user) => {
    //     if (!user) {
    //       return res
    //         .status(404)
    //         .json({ success: false, msg: 'User not found' });
    //     }
    //     const filter = { _id: id };
    //     const update = {
    //       playedGames: user.playedGames + 1,
    //       victory: user.victory + victory,
    //       defeat: user.defeat + defeat,
    //       bestScore: user.bestScore > score ? user.bestScore : score,
    //       bestLevel: user.bestLevel > level ? user.bestLevel : level,
    //     };
    //     User.findByIdAndUpdate(filter, update, { new: true }).then(
    //       (updated) => {
    //         if (!updated) {
    //           return res.status(500).json({
    //             success: false,
    //             msg: 'An error occured when updating score',
    //           });
    //         }
    //         return res.status(200).json({
    //           success: true,
    //           msg: 'Score updated successfully',
    //           updated,
    //         });
    //       }
    //     );
    //   })
    //   .catch((err) => {
    //     return res.status(404).json({ success: false, msg: 'User not found' });
    //   });
  };
}
