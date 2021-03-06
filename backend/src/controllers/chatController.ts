import { Request, Response, NextFunction } from "express";
import Chat from "../models/chat.model";
import ApiFeatures from "../utils/ApiFeatures";
import AppError from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";

export const sendChatMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const sender = req.user?._id;
    const receiver = req.params.id;

    if (!receiver) {
      return next(new AppError("receiver Id is required", 400));
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

    res.status(200).json({
      status: "success",
      noOfMessages: messages.length,
      messages,
    });
  }
);

export const updateChatMessageStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // user can only update status
    if (
      req.body.text ||
      req.body.users ||
      req.body.senderId ||
      req.body.images
    ) {
      return next(
        new AppError("text, users, senderId or images cannot be updated", 400)
      );
    }

    // update messageStatus
    const updatedChat = await Chat.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });

    res.status(201).json({
      status: "success",
      updatedChat,
    });
  }
);
