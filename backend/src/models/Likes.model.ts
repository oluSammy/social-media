import mongoose from "mongoose";
import { ILikes } from "../types/types";

const likesSchema = new mongoose.Schema<ILikes>(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "post id is required"],
      ref: "Post",
    },
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "user liking post id is required"],
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Likes = mongoose.model("Likes", likesSchema);

export default Likes;
