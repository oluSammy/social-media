import { Response, Request, NextFunction } from "express";
import AppError from "../utils/AppError";
import catchAsyncFactoryFn from "../utils/catchAsync";

export const getOne = catchAsyncFactoryFn(
  async (req: Request, res: Response, next: NextFunction, Model: any) => {
    const { id } = req.params;

    const doc = await Model.findById(id);

    if (!doc) return next(new AppError("document not found", 400));

    res.status(200).json({
      status: "success",
      data: doc,
    });
  }
);

export const createOne = catchAsyncFactoryFn(
  async (
    req: Request,
    res: Response,
    next: NextFunction,
    Model: any,
    validateInput: any
  ) => {
    if (validateInput) {
      const { error } = validateInput(req.body);

      if (error) {
        return next(new AppError(`${error.message}`, 400));
      }
    }
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: doc,
    });
  }
);

export const updateOne = catchAsyncFactoryFn(
  async (
    req: Request,
    res: Response,
    next: NextFunction,
    Model: any,
    validateInput: any
  ) => {
    const { id } = req.params;

    const { error } = validateInput(req.body);

    if (error) {
      return next(new AppError(`${error.message}`, 400));
    }

    const doc = await Model.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });

    res.status(201).json({
      status: "success",
      data: doc,
    });
  }
);

export const deleteOne = catchAsyncFactoryFn(
  async (req: Request, res: Response, next: NextFunction, Model: any) => {
    const { id } = req.params;

    const doc = await Model.findByIdAndDelete(id);
    if (!doc) return next(new AppError("organization not found", 400));

    res.status(204).json({
      status: "success",
    });
  }
);

export const getAll = catchAsyncFactoryFn(
  async (req: Request, res: Response, next: NextFunction, Model: any) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const totalCount = await Model.countDocuments();

    const prevPage = page === 1 ? null : page - 1;
    const nextPage = page * limit >= totalCount ? null : page + 1;

    const docs = await Model.find()
      .skip((page - 1) * limit)
      .limit(limit);

    /**
     * 20 docs t0tal
     * limit 5
     * page 1
     * 1 - 5 skip(0).limit(5)
     * page 2
     * 6 - 10 skip(5).limit(5)
     */

    res.status(200).json({
      status: "success",
      results: docs.length,
      previous: prevPage,
      next: nextPage,
      data: docs,
    });
  }
);
