import {
  searchPosts,
  searchPostsAndUsers,
  searchUsers,
} from "./../controllers/searchController";
import express from "express";

const router = express.Router();

router.route("/").get(searchPostsAndUsers);
router.route("/users").get(searchUsers);
router.route("/posts").get(searchPosts);

export default router;
