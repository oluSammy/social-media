import { catchAsync } from "./../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import Post from "../models/post.model";
import User from "../models/user.model";
import ApiFeatures from "../utils/ApiFeatures";

export const searchPostsAndUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.search) {
      return next(new AppError("search query was not provided", 400));
    }

    const posts = await Post.find({
      $text: { $search: req.query.search as string },
    });
    const users = await User.find({
      $text: { $search: req.query.search as string },
    });

    return res.status(200).json({
      message: "success",
      users,
      posts,
    });
  }
);

export const searchUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.search) {
      return next(new AppError("search query was not provided", 400));
    }

    const usersQuery = new ApiFeatures(
      User.find({ $text: { $search: req.query.search as string } }),
      req.query
    )
      .sort()
      .limit()
      .paginate();

    const users = await usersQuery.query;

    return res.status(200).json({
      message: "success",
      users,
    });
  }
);

export const searchPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.search) {
      return next(new AppError("search query was not provided", 400));
    }

    const postsQuery = new ApiFeatures(
      Post.find({ $text: { $search: req.query.search as string } }),
      req.query
    )
      .sort()
      .limit()
      .paginate();

    const posts = await postsQuery.query;

    return res.status(200).json({
      message: "success",
      posts,
    });
  }
);
