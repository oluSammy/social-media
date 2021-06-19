import express, { Request, Response, NextFunction } from 'express';
import logger from 'morgan';
import AppError from './utils/AppError';
import globalErrorHandler from './controllers/errorController';

const app = express();

// global middleware
app.use(express.json());

app.use(logger('dev'));

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Hello social media!!' });
});

// handles all request url that do not exits on the server
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`can't find ${req.url} on this server`, 404));
});

// handles all global error
app.use(globalErrorHandler);

export default app;
