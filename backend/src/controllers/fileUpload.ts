import { Request } from "express";
import multer from "multer";
import AppError from "../utils/AppError";
import dotenv from "dotenv";

dotenv.config();

import cloudinary from "cloudinary";

const multerStorage = multer.diskStorage({});

const multerFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image please upload only images", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPic = upload.fields([
  { name: "profilePic", maxCount: 1 },
  { name: "coverPhoto", maxCount: 1 },
]);

export const uploadPostPictures = upload.fields([
  { name: "photos", maxCount: 2 },
]);

cloudinary.v2.config({
  cloud_name: "olumorinsamuel",
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

export default cloudinary;
