import mongoose from "mongoose";
import { IComment } from "./../types/types";

const commentSchema = new mongoose.Schema<IComment>(
  {
    text: {
      type: String,
      maxLength: [300, "comment cannot be more than 300 characters"],
      minLength: [1, "comment must be at least 1 character"],
    },
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "createdBy",
    select: "firstName lastName username bio followers following profilePic",
  }).populate("numberOfLikes");

  next();
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
