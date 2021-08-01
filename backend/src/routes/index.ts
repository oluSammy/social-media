import express, { Request, Response } from 'express';
import usersRouter from '../routes/user.routes';
import socialAuthRoutes from '../routes/socialLoginAuth.routes';
import { followUser } from '../controllers/user.controller';

const router = express.Router();

router.use('/users', usersRouter);


router.use('/auth', socialAuthRoutes)
// router.get("/follow", followUser);

router.get('/', (_req: Request, res: Response) => {
  res.send('social app is live');
});

export default router;
