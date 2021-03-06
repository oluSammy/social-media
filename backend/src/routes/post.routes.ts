import { uploadPostPictures } from "./../controllers/fileUpload";
import {
  createPost,
  handlePostPictures,
  getPost,
  deletePostPicture,
  deletePost,
  deleteLikesAndComments,
  getPosts,
  getTimelinePosts,
  getUserPost,
} from "./../controllers/post.controller";
import express from "express";

const router = express.Router();

router.route("/timeline").get(getTimelinePosts);
router.route("/user/:id").get(getUserPost);

router
  .route("/")
  .post(uploadPostPictures, handlePostPictures, createPost)
  .get(getPosts);

router
  .route("/:id")
  .get(getPost)
  .delete(deletePostPicture, deleteLikesAndComments, deletePost);

export default router;
