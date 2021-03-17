import { Request, Response, NextFunction } from 'express';

const logger = (req: Request, res: Response, next: NextFunction): void => {
	console.log(
		`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
	);
	// Every middleware needs to call next for passing control to the next action
	// to be perfomed
	next();
};

export default logger;