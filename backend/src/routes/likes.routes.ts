import { likePost } from "../controllers/likesController";
import { protectRoute } from "../controllers/authController";
import express from "express";

const router = express.Router();

router.post("/:id", likePost);

export default router;
