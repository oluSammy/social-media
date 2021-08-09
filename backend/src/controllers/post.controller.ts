import { IPost } from "./../types/types";
import { NextFunction, Request, Response } from "express";
import Post from "../models/post.model";
import { catchAsync } from "./../utils/catchAsync";
import cloudinary from "cloudinary";
import { deleteOne, getOne } from "./factoryFunctions";
import AppError from "../utils/AppError";
import Likes from "../models/Likes.model";

interface MulterRequest extends Request {
  files?: any;
}

export const handlePostPictures = catchAsync(
  async (req: MulterRequest, res: Response, next: NextFunction) => {
    if (req.files && req.files.photos) {
      const photos = req.files.photos.map(
        async (photo: any) => await cloudinary.v2.uploader.upload(photo.path)
      );

      const uploadedPhotos = (await Promise.all(photos)).map((photo: any) => ({
        cloudId: photo.public_id,
        url: photo.url,
      }));

      req.photos = uploadedPhotos;
    }
    next();
  }
);

export const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const post: IPost = {
      createdBy: req.user?._id,
      ...req.body,
    };

    if (req.photos) {
      post.photos = req.photos;
    }

    const newPost = await Post.create(post);

    res.status(201).json({
      post: newPost,
    });
  }
);

export const getPost = (req: Request, res: Response, next: NextFunction) => {
  getOne(req, res, next, Post);
};

export const deletePostPicture = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const post: IPost = await Post.findById(req.params.id);

    if (`${post.createdBy._id}` !== `${req.user!._id}`) {
      return next(
        new AppError(`you are not authorized to delete this post`, 401)
      );
    }

    try {
      if (post.photos.length) {
        const deletePhotos = post.photos.map((photo) => {
          cloudinary.v2.uploader.destroy(photo.cloudId);
        });
        await Promise.all(deletePhotos);
      }

      return next();
    } catch (e) {
      return next(new AppError("error deleting post", 500));
    }
  }
);

// TODO
export const deleteLikesAndComments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await Likes.deleteMany({ postId: req.params.id });

    next();
  }
);

export const deletePost = (req: Request, res: Response, next: NextFunction) => {
  // delete likes and comments
  deleteOne(req, res, next, Post);
};
