import { Response, Request, NextFunction } from "express";
import ApiFeatures from "../utils/ApiFeatures";
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
    // build query
    const features = new ApiFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();

    // execute query
    const doc = await features.query;

    // send response
    res
      .status(200)
      .json({ message: "success", results: doc.length, data: doc });
  }
);
