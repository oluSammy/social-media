import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import Follower from "../models/follower.model";
import Following from "../models/following.model";

export const followUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const currentUser = req.user;

    if (!userId) {
      return next(new AppError("follower parameter missing", 400));
    }

    // find user to follow or un follow
    const userFollowers = await Follower.findOne({ userId });
    const userFollowings = await Following.findOne({
      userId: currentUser?._id,
    });

    if (!userFollowers) {
      await Follower.create({
        userId,
        followers: [currentUser?._id],
        numberOfFollowers: 1,
      });
    }

    if (!userFollowings) {
      const data = await Following.create({
        userId: currentUser?._id,
        followings: [userId],
        numberOfFollowings: 1,
      });
    }

    if (userFollowers) {
      if (userFollowers.followers.includes(currentUser?._id)) {
        await Follower.findOneAndUpdate(
          { userId },
          {
            $pull: { followers: currentUser?._id },
            $inc: { numberOfFollowers: -1 },
          }
        );
      } else {
        await Follower.findOneAndUpdate(
          { userId },
          {
            $push: { followers: currentUser?._id },
            $inc: { numberOfFollowers: 1 }, //
          }
        );
      }
    }

    if (userFollowings) {
      if (userFollowings.followings.includes(userId)) {
        await Following.findOneAndUpdate(
          { userId: currentUser?._id as string },
          {
            $pull: { followings: userId },
            $inc: { numberOfFollowings: -1 },
          }
        );
      } else {
        await Following.findOneAndUpdate(
          { userId: currentUser?._id as string },
          {
            $push: { followings: userId },
            $inc: { numberOfFollowings: 1 },
          }
        );
      }
    }

    res.status(200).json({
      status: "success",
    });
  }
);
