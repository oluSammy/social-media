import express, { Request, Response } from "express";
import commentRoute from "../routes/comments.routes";
import usersRouter from "../routes/user.routes";
import postRouter from "../routes/post.routes";
import likesRouter from "../routes/likes.routes";
import socialAuthRoutes from "../routes/socialLoginAuth.routes";

const router = express.Router();

router.use("/users", usersRouter);
router.use("/comments", commentRoute);
router.use("/post", postRouter);
router.use("/likes", likesRouter);

// router.su

router.use("/auth", socialAuthRoutes);
// router.get("/follow", followUser);

router.get("/", (_req: Request, res: Response) => {
  res.send("social app is live");
});

export default router;
