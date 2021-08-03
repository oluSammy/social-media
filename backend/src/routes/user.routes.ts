import { followUser } from "./../controllers/user.controller";
import { NextFunction, Request, Response } from "express";
import express from "express";
import {
  signUp,
  login,
  updatePassword,
  protectRoute,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/updatePassword", protectRoute, updatePassword);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);

router.post("/follow/:id", protectRoute, followUser);

export default router;
