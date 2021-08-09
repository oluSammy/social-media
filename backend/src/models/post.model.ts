import { IPost } from "./../types/types";
import mongoose from "mongoose";

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
  }
);

function arrayLimit(val: any) {
  return val.length <= 3;
}

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: "createdBy",
    select:
      "firstName lastName username bio followers following profilePic",
  });

  next();
});

const Post = mongoose.model("Post", postSchema);

export default Post;
