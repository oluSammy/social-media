import { NextFunction, Request, Response } from "express";

const catchAsyncFactoryFn = (fn: any) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
    model?: any,
    validateFn?: any
  ) => {
    fn(req, res, next, model, validateFn).catch(next);
  };
};

export const catchAsync = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsyncFactoryFn;
