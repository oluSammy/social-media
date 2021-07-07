import express, { Request, Response } from "express";
import passport from "passport";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/api/social/v1/auth/google/profile",
    failureRedirect: "/api/social/v1/auth/google/failure",
  })
);

router.get("/google/profile", (req: Request, res: Response) => {
  console.log(req.session.passport.user);
  res.status(200).json({ message: "success" });
});

router.get("google/fail", (req: Request, res: Response) => {
  res.status(401).json({
    status: "fail",
    message: "you are not authorized",
  });
});

router.get("/fb", passport.authenticate("facebook", { scope: "email" }));

router.get(
  "/fb/callback",
  passport.authenticate("facebook", {
    successRedirect: "/api/social/v1/auth/fb/profile",
    failureRedirect: "/api/social/v1/auth/fb/fail",
  })
);

router.get("/fb/profile", (req: Request, res: Response) => {
  console.log(req.session.passport.user);
  res.status(200).json({ message: "success" });
});

router.get("fb/fail", (req: Request, res: Response) => {
  res.status(401).json({
    status: "fail",
    message: "you are not authorized",
  });
});

export default router;
