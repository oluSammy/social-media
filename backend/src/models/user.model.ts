import mongoose from "mongoose";
import { IUser } from "../types/types";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "first name is required"],
    },
    lastName: {
      type: String,
      required: [true, "first name is required"],
    },
    username: {
      type: String,
      unique: true,
      required: [true, "username is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "a user with this email already exits"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "pls confirm your password"],
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordExpires: String,
    passwordResetTokenExpires: Date,
    bio: {
      type: String,
    },
    photo: String,
    followers: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Follower",
    },
    followings: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Following",
    },
    profilePic: String,
    coverPhoto: String,
    profilePicCloudinaryId: String,
    coverPhotoCloudinaryId: String,
  },
  {
    timestamps: true,
  }
);

// creating index for search
userSchema.index({ username: "text", lastName: "text", firstName: "text" });

//pre save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified) return next();

  this.password = await bcrypt.hash(this.password, 12);

  // delete passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "followers",
    select: "numberOfFollowers -_id",
  }).populate({
    path: "followings",
    select: "numberOfFollowings -_id",
  });

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
