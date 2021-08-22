import { Request, Response, NextFunction } from "express";
import Chat from "../models/chat.model";
import ApiFeatures from "../utils/ApiFeatures";
import AppError from "../utils/AppError";
import { catchAsync } from "./../utils/catchAsync";

export const sendChatMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const sender = req.user?._id;
    const receiver = req.params.id;

    if (!receiver) {
      next(new AppError("receiver Id is required", 400));
    }

    const chat = await Chat.create({
      users: [sender, receiver],
      senderId: sender,
      text: req.body.text,
    });

    res.status(201).json({
      status: "success",
      chat,
    });
  }
);

export const getChatMessages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { receiverId } = req.params;

    const messagesQuery = new ApiFeatures(
      Chat.find({ users: { $all: [req.user?._id, receiverId] } }),
      req.query
    )
      .limit()
      .sort()
      .paginate();

    const messages = await messagesQuery.query;

    res.status(201).json({
      status: "success",
      noOfMessages: messages.length,
      messages,
    });
  }
);
