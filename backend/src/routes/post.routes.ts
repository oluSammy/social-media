import { uploadPostPictures } from "./../controllers/fileUpload";
import {
  createPost,
  handlePostPictures,
  getPost,
  deletePostPicture,
  deletePost,
  deleteLikesAndComments,
  getPosts,
} from "./../controllers/post.controller";
import { protectRoute } from "./../controllers/authController";
import express from "express";

const router = express.Router();

router
  .route("/")
  .post(protectRoute, uploadPostPictures, handlePostPictures, createPost)
  .get(protectRoute, getPosts);

router
  .route("/:id")
  .get(protectRoute, getPost)
  .delete(protectRoute, deletePostPicture, deleteLikesAndComments, deletePost);

export default router;
