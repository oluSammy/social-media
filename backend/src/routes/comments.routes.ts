import express from "express";
import { createComment, getComment } from "./../controllers/commentsController";

const router = express.Router();

router.route("/:id").post(createComment).get(getComment);

export default router;
