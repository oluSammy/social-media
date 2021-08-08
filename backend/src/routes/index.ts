import express, { Request, Response } from "express";
import usersRouter from "../routes/user.routes";
import postRouter from "../routes/post.routes";
import socialAuthRoutes from "../routes/socialLoginAuth.routes";

const router = express.Router();

router.use("/users", usersRouter);
router.use("/post", postRouter);

router.use("/auth", socialAuthRoutes);
// router.get("/follow", followUser);

router.get("/", (_req: Request, res: Response) => {
  res.send("social app is live");
});

export default router;
