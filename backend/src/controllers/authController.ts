import {
  validateLogin,
  validateSignUp,
  validateUpdatePassword,
  validateResetPassword,
} from "../validation/validation";
import { catchAsync } from "../utils/catchAsync";
import { Request, Response, NextFunction, CookieOptions } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import User from "../models/user.model";
import { IUser } from "../types/types";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../utils/email";

const generateToken = (id: string): string => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES as string,
  });

  return token;
};

const sendToken = (res: Response, statusCode: number, user: IUser) => {
  const token = generateToken(user._id as string);

  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + 20 * 24 * 60 * 1000),
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;

  return res.status(statusCode).json({
    status: "successful",
    user,
    token,
  });
};

const createPasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  return { resetToken, hashedToken };
};

const validatePassword = async (
  loginPass: string,
  dbPass: string
): Promise<boolean> => {
  return await bcrypt.compare(loginPass, dbPass);
};

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // validate req.body
    const { error } = validateSignUp(req.body);
    if (error) {
      return next(new AppError(`${error.message}`, 400));
    }

    const { firstName, lastName, email, password, passwordConfirm, username } =
      req.body;

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
      username,
    });

    sendToken(res, 201, user);
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // validate req.body
    const { error } = validateLogin(req.body);

    if (error) {
      return next(new AppError(`${error.message}`, 400));
    }

    const { email, password, username } = req.body;

    if (!email && !username) {
      return new AppError("please specify email or username", 400);
    }

    // user logs in with email
    if (email) {
      const user = await User.findOne({ email }).select("+password");

      if (!user || !(await validatePassword(password, user.password))) {
        return next(new AppError(`invalid login credentials`, 400));
      }

      sendToken(res, 200, user);
    }

    // user logs in with username
    const user = await User.findOne({ username }).select("+password");

    if (!user || !(await validatePassword(password, user.password))) {
      return next(new AppError(`invalid login credentials`, 400));
    }

    sendToken(res, 200, user);
  }
);

export const protectRoute = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError(`please login to access this resource`, 401));
    }

    const decodedToken: any = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    );

    if (!decodedToken) {
      return next(new AppError("user no longer exist", 404));
    }

    const user = await User.findById(decodedToken.id);

    req.user = user;

    next();
  }
);

export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get user from db
    const user = await User.findById(req.user!._id).select("+password");

    if (!user) return next(new AppError("user does not exist", 404));

    // validate req.ody
    const { error } = validateUpdatePassword(req.body);
    if (error) {
      return next(new AppError(`${error.message}`, 400));
    }

    const { prevPassword, newPassword, newPasswordConfirm } = req.body;

    // check if password is correct
    const isPasswordCorrect = await validatePassword(
      prevPassword,
      user.password
    );

    // console.log(isPasswordCorrect);

    if (!isPasswordCorrect)
      return next(new AppError("invalid credentials", 400));

    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;

    await user.save();

    sendToken(res, 200, user);
  }
);

// forgot password
export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // check if user exits
    const user = await User.findOne({ email: req.body!.email });
    if (!user) {
      return next(new AppError("user not found", 404));
    }

    const passwordExpires = Date.now() + 10 * 60 * 1000;

    // create passwordResetToken
    const { resetToken, hashedToken } = createPasswordResetToken();

    await User.findByIdAndUpdate(
      user._id,
      {
        passwordExpires,
        passwordResetToken: hashedToken,
      },
      {
        runValidators: true,
        new: true,
      }
    );

    const reqUrl = `${req.protocol}://${req.get(
      "host"
    )}/resetPassword/${resetToken}`;

    const message = `Forgot your password?, follow this link ${reqUrl} to reset your password\n
    ❗️ If you did not request for a password reset, kindly ignore this email`;

    try {
      await sendEmail({
        email: req.body!.email,
        message,
        subject: "Reset Password, valid for 10mins",
      });

      return res.status(200).json({
        status: "successful",
        message: "password reset token has been sent to your email",
      });
    } catch (e) {
      user.passwordExpires = undefined;
      user.passwordResetToken = undefined;

      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          "There was an error sending a password reset email, please try again",
          500
        )
      );
    }
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;

    const { error } = validateResetPassword(req.body);

    if (error) {
      return next(new AppError(`${error.message}`, 400));
    }

    console.log(token);

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordExpires: { $gt: Date.now() },
    });

    if (!user) return next(new AppError("token expired or invalid", 400));

    const { password, passwordConfirm } = req.body;

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordExpires = undefined;

    await user.save();

    sendToken(res, 200, user);
  }
);
