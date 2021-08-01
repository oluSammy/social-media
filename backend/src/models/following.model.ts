import { IFollow } from "./../types/types";
import mongoose from "mongoose";

const followingSchema = new mongoose.Schema<IFollow>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  followings: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  numberOfFollowings: Number,
});

const Following = mongoose.model("Following", followingSchema);

export default Following;
