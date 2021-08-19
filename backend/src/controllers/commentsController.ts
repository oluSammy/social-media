import Comment from "../models/comments.model";
import { getOne } from "./factoryFunctions";
import { NextFunction } from "express";
import { Request, Response } from "express";
import { catchAsync } from "./../utils/catchAsync";
import ApiFeatures from "../utils/ApiFeatures";

export const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;

    const comment = await Comment.create({
      text: req.body.text,
      postId,
      createdBy: req.user!._id,
    });

    res.status(201).json({
      status: "success",
      comment,
    });
  }
);

export const getCommentsOfPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentQuery = new ApiFeatures(
      Comment.find({ postId: req.params.id }),
      req.query
    )
      .limit()
      .sort()
      .paginate();

    const comments = await commentQuery.query;

    return res.status(200).json({ status: "success", comments });
  }
);

export const getComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    getOne(req, res, next, Comment);
  }
);
