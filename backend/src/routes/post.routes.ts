import { uploadPostPictures } from "./../controllers/fileUpload";
import {
  createPost,
  handlePostPictures,
  getPost,
} from "./../controllers/post.controller";
import { protectRoute } from "./../controllers/authController";
import express from "express";

const router = express.Router();

router
  .route("/")
  .post(protectRoute, uploadPostPictures, handlePostPictures, createPost);

router.route("/:id").get(protectRoute, getPost);

export default router;
