import Comment from "../models/comments.model";
import { getOne } from "./factoryFunctions";
import { NextFunction } from "express";
import { Request, Response } from "express";
import { catchAsync } from "./../utils/catchAsync";

export const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;

    const comment = await Comment.create({
      text: req.body.text,
      postId,
      createdBy: req.user!._id,
    });

    res.status(201).json({
      message: "successful",
      comment,
    });
  }
);

export const getComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    getOne(req, res, next, Comment);
  }
);
