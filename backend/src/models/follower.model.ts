import { IFollow } from "./../types/types";
import mongoose from "mongoose";

const followerSchema = new mongoose.Schema<IFollow>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  followers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  numberOfFollowers: Number,
});

const Follower = mongoose.model("Follower", followerSchema);

export default Follower;
