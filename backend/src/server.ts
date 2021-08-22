import {
  addToLoggedIn,
  logOut,
  getFriends,
  getUserById,
  getUserBySocketId,
} from "./controllers/socketController";
import {
  ISendMessageArg,
  IUser,
  ITyping,
  IMessageDeliveredArg,
} from "./types/types";
import app from "./app";
import dotenv from "dotenv";
import { HttpError } from "http-errors";
import http from "http";
import { Server, Socket } from "socket.io";
import Following from "./models/following.model";
import Follower from "./models/follower.model";
import Chat from "./models/chat.model";

const httpServer = http.createServer(app);

dotenv.config();

export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// socket auth middleware
io.use((socket, next) => {
  if (true) {
    console.log("SOCKET DETAILS");
    // console.log(socket.request);
    next();
  } else {
    next(new Error("invalid"));
  }
});

io.on("connection", (socket: Socket) => {
  console.log("A User Connected, Congrats");

  socket.on("login", async (user: IUser) => {
    // add to online logged in users
    addToLoggedIn(socket.id, user);

    // get users following the newly logged in user from DB
    const userFollowers = await Follower.findOne({ userId: user._id });

    // get users following the newly logged in user from online logged in user
    const friends = getFriends(userFollowers.followers);

    // notify the followers of the logged in user that a friend just logged in
    friends.forEach((friend) => {
      io.to(friend.socketId).emit("new-login", user);
    });
  });

  socket.on("get-online-friends", async (userId: string) => {
    // get all users the new user follows
    const userFollowings = await Following.findOne({ userId });

    // get users in the userFollowers Array
    const friends = getFriends(userFollowings.followings);

    io.to(socket.id).emit("online-friends", friends);
  });

  // typing message listener
  socket.on("typing-chat", ({ recipient }: ITyping, cb) => {
    const sender = getUserBySocketId(socket.id);

    const messageRecipient = getUserById(recipient._id);

    if (messageRecipient) {
      io.to(messageRecipient?.socketId).emit("friend-typing", sender);
    }
  });

  // send message listener
  socket.on(
    "send-chat",
    async ({ recipient, message }: ISendMessageArg, cb) => {
      const sender = getUserBySocketId(socket.id);

      try {
        const newChat = await Chat.create({
          users: [sender._id, recipient._id],
          senderId: sender._id,
          text: message,
        });

        io.to(recipient?.socketId).emit("message-sent", {
          chat: newChat,
          sender,
        });

        cb();
      } catch (e) {
        cb(e);
      }
    }
  );

  // message delivered listener
  socket.on(
    "message-delivered",
    ({ sentBy, message }: IMessageDeliveredArg) => {
      const receivedBy = getUserBySocketId(socket.id);

      io.to(receivedBy?.socketId).emit("chat-delivered", {
        sentBy,
        message,
      });
    }
  );

  // message read listener
  socket.on("message-read", ({ sentBy, message }: IMessageDeliveredArg) => {
    const receivedBy = getUserBySocketId(socket.id);

    io.to(receivedBy?.socketId).emit("chat-read", {
      sentBy,
      message,
    });
  });

  socket.on("disconnect", async () => {
    // remove user from online users
    const user = logOut(socket.id);

    // get users following the newly logged in user from DB
    const userFollowers = await Follower.findOne({ userId: user._id });

    // get all users following the logged out user
    const friends = getFriends(userFollowers.followers);

    // notify them that a friend just logged out s
    friends.forEach((friend) => {
      io.to(friend.socketId).emit("new-logout", user);
    });
  });

  socket.on("test", (test) => {
    console.log(`The test code received was ${test}`);
  });
});

process.on("unhandledRejection", (err: HttpError) => {
  console.log("Unhandled Rejection, shutting down");
  console.log(err.name, err.message, err);
});

const port = (process.env.PORT as number | undefined) || 5000;

const server = httpServer.listen(port, () => {
  console.log(`server running on port 5000 http://127.0.0.1:${port}`);
});

process.on("uncaughtException", (err: HttpError) => {
  console.log("uncaught exception, shutting down ...");
  console.log(err.name, err.message, err);
  server.close(() => {
    process.exit(1);
  });
});
