import mongoose from 'mongoose';
import { IUser } from '../types/types';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, 'first name is required'],
    },
    lastName: {
      type: String,
      required: [true, 'first name is required'],
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: [true, 'a user with this email already exits'],
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'pls confirm your password'],
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
  },
  {
    timestamps: true,
  }
);

//pre save middleware to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified) return next();

  this.password = await bcrypt.hash(this.password, 12);

  // delete passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model('User', userSchema);

export default User;
