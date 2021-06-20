import express, { Request, Response, NextFunction } from 'express';
import logger from 'morgan';
import AppError from './utils/AppError';
import globalErrorHandler from './controllers/errorController';
import indexRouter from './routes/index';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(
  session({
    secret: process.env.PASSPORT_SECRET as string,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// global middleware
app.use(express.json());

app.use(logger('dev'));

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.redirect('/api/social/v1');
});

app.use('/api/social/v1', indexRouter);

// handles all request url that do not exits on the server
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`can't find ${req.url} on this server`, 404));
});

// handles all global error
app.use(globalErrorHandler);

export default app;
