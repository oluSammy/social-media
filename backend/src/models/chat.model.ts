import mongoose from "mongoose";
import { IMessage } from "../types/types";

const chatSchema = new mongoose.Schema<IMessage>(
  {
    users: {
      type: [{ type: mongoose.Types.ObjectId, ref: "User" }],
      validate: {
        validator: function (this: IMessage) {
          return this.users.length === 2;
        },
        message: () => "expected sender Id and receiver Id",
      },
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: [true, "senderId is required"],
    },
    images: {
      type: [String],
    },
    text: {
      type: String,
      required: [true, "text is required"],
      maxLength: [3000, "comment cannot be more than 3000 characters"],
      minLength: [1, "comment must be at least 1 character"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
