import app from "./app";
import dotenv from "dotenv";
import { HttpError } from "http-errors";
import http from "http";
import { Server, Socket } from "socket.io";

const httpServer = http.createServer(app);

dotenv.config();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: Socket) => {
  // ...
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
