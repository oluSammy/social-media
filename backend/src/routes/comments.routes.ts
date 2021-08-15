import express from "express";
import {
  createComment,
  getComment,
  getCommentsOfPost,
} from "./../controllers/commentsController";

const router = express.Router();

router.route("/:id").post(createComment).get(getComment);
router.route("/post/:id").get(getCommentsOfPost);

export default router;
