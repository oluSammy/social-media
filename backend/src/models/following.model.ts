import { IFollow } from "./../types/types";
import mongoose from "mongoose";

const followingSchema = new mongoose.Schema<IFollow>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followings: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    numberOfFollowings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Following = mongoose.model("Following", followingSchema);

export default Following;
