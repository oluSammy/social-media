import express from "express";
import { protectRoute } from "../controllers/authController";
import { createComment, getComment } from "./../controllers/commentsController";

const router = express.Router();

router
  .route("/:id")
  .post(protectRoute, createComment)
  .get(protectRoute, getComment);

export default router;
