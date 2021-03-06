import { uploadUserPic } from "./../controllers/fileUpload";
import { followUser } from "./../controllers/user.controller";

import express from "express";
import {
  signUp,
  login,
  updatePassword,
  protectRoute,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";
import {
  updateMe,
  getUserFollowers,
  getUserFollowings,
} from "../controllers/user.controller";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/updatePassword", protectRoute, updatePassword);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);

router.post("/follow/:id", protectRoute, followUser);
router.get("/followers/:id", protectRoute, getUserFollowers);
router.get("/followings/:id", protectRoute, getUserFollowings);

router.patch("/updateMe", protectRoute, uploadUserPic, updateMe);

export default router;
