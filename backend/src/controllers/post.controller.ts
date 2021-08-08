import { IPost } from "./../types/types";
import { NextFunction, Request, Response } from "express";
import Post from "../models/post.model";
import { catchAsync } from "./../utils/catchAsync";
import cloudinary from "cloudinary";

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

export const getPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;

    const post = await Post.findById(postId);

    res.status(200).json({
      message: "success",
      post,
    });
  }
);
