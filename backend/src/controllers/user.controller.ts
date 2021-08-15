import { IUser } from "./../types/types";
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import Follower from "../models/follower.model";
import Following from "../models/following.model";
import cloudinary from "cloudinary";
import User from "../models/user.model";

interface MulterRequest extends Request {
  files?: any;
}

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

export const updateMe = catchAsync(
  async (req: MulterRequest, res: Response, next: NextFunction) => {
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          "this route is not for password updates, please use /updatePassword",
          400
        )
      );
    }

    const updatedUser: IUser = { ...req.body };

    if (req.files && req.files.coverPhoto) {
      try {
        const result = await cloudinary.v2.uploader.upload(
          req.files.coverPhoto[0].path,
          { width: 1500, height: 500, crop: "fill" }
        );

        if (req.user) {
          updatedUser.coverPhoto = result.url;
          updatedUser.coverPhotoCloudinaryId = result.public_id;
        }

        if (req.user?.coverPhotoCloudinaryId) {
          await cloudinary.v2.uploader.destroy(
            req.user?.coverPhotoCloudinaryId
          );
        }
      } catch (err) {
        return next(new AppError("Error uploading coverPhoto", 500));
      }
    }

    if (req.files && req.files.profilePic) {
      try {
        const result = await cloudinary.v2.uploader.upload(
          req.files.profilePic[0].path,
          { width: 200, height: 180, crop: "fit" }
        );

        if (req.user) {
          updatedUser.profilePic = result.url;
          updatedUser.profilePicCloudinaryId = result.public_id;
        }

        if (req.user?.profilePicCloudinaryId) {
          await cloudinary.v2.uploader.destroy(
            req.user?.profilePicCloudinaryId
          );
        }
      } catch (err) {
        return next(new AppError("Error uploading profile picture", 500));
      }
    }

    const newUser = await User.findByIdAndUpdate(req.user!._id, updatedUser, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: "profile update success",
      user: newUser,
    });
  }
);
