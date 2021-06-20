import express, { Request, Response } from 'express';
import usersRouter from '../routes/user.routes';
import { protectRoute } from '../controllers/authController';

const router = express.Router();

router.use('/users', usersRouter);

router.get('/', protectRoute, (_req: Request, res: Response) => {
  res.send('social app is live');
});

export default router;
