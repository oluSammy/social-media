import mongoose from "mongoose";
import { IPost } from "./../types/types";
import Likes from "./Likes.model";

const postSchema = new mongoose.Schema<IPost>(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "post creator is required"],
      ref: "User",
    },
    photos: {
      type: [{ cloudId: String, url: String }],
      validate: [arrayLimit, "cannot upload more than 2 pictures"],
    },
    text: {
      type: String,
      maxLength: [300, "A tour name must be less or equal to 300 chars"],
      minLength: [1, "A tour name must be more than 1 chars"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

function arrayLimit(val: any) {
  return val.length <= 3;
}

// creating index for search
postSchema.index({ text: "text" });

postSchema.virtual("numberOfLikes", {
  ref: "Likes",
  localField: "_id",
  foreignField: "postId",
  justOne: false,
  count: true,
});

postSchema.virtual("numberOfComments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
  justOne: false,
  count: true,
});

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: "createdBy",
    select: "firstName lastName username bio followers following profilePic",
  })
    .populate("numberOfLikes")
    .populate("numberOfComments");

  next();
});

const Post = mongoose.model("Post", postSchema);

export default Post;
