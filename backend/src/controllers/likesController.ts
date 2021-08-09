import { catchAsync } from "./../utils/catchAsync";
import Likes from "../models/Likes.model";
import Post from "../models/post.model";
import { Request, Response, NextFunction, CookieOptions } from "express";
import AppError from "../utils/AppError";

export const likePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
      return next(new AppError("post id missing", 400));
    }

    const liked = await Likes.findOne({
      postId: req.params.id,
      likedBy: req.user!._id,
    });

    if (liked) {
      await Likes.deleteOne({ likedBy: req.user!._id, postId: req.params.id });
      return res.status(201).json({
        message: "post un-liked",
      });
    }

    await Likes.create({
      postId: req.params.id,
      likedBy: req.user!._id,
    });

    res.status(201).json({
      message: "post liked successfully",
    });
  }
);

