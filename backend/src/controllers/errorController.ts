import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import AppError from '../utils/AppError';

const handleDuplicateDb = (err: HttpError) => {
  const duplicate = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value ${duplicate}, use another value`;
  return new AppError(message, 400);
};

const handleValidationDb = (err: HttpError) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJwtErrValidationError = () =>
  new AppError('Invalid token, please login again', 401);

const handleJwtExpiredError = () =>
  new AppError('Your token has expired, login again', 401);

const sendErrDev = (err: HttpError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err.message,
    errorStack: err.stack,
  });
};

const sendProdErr = (err: HttpError, res: Response) => {
  if (err.isOperational) {
    console.log(err.message);

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //Programming or other unknown error: don't leak details
  } else {
    console.log('Error🎈', err);
    res.status(500).json({
      status: 'Error',
      message: `Something went wrong`,
    });
  }
};

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status;

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else {
    // console.log(err.isOperational);

    if (err.code === 11000) err = handleDuplicateDb(err);
    if (err._message === 'Validation failed') err = handleValidationDb(err);
    if (err.name === 'JsonWebTokenError') err = handleJwtErrValidationError();
    if (err.name === 'TokenExpiredError') err = handleJwtExpiredError();

    sendProdErr(err, res);
  }

  next();
};

export default errorHandler;
