import {
  addToLoggedIn,
  logOut,
  getFriends,
} from "./controllers/socketController";
import { IUser } from "./types/types";
import app from "./app";
import dotenv from "dotenv";
import { HttpError } from "http-errors";
import http from "http";
import { Server, Socket } from "socket.io";
import Following from "./models/following.model";
import Follower from "./models/follower.model";

const httpServer = http.createServer(app);

dotenv.config();

export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  if (true) {
    console.log("SOCKET DETAILS");
    console.log(socket.request);
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

    // // get users following the newly logged in user from online logged in user
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
