import express, { Request, Response } from 'express';
import usersRouter from '../routes/user.routes';
import socialAuthRoutes from '../routes/socialLoginAuth.routes';

const router = express.Router();

router.use('/users', usersRouter);

router.use('/auth', socialAuthRoutes)

router.get('/', (_req: Request, res: Response) => {
  res.send('social app is live');
});

export default router;
