import app from './app';
import dotenv from 'dotenv';
import { connectDB } from './database/dbConnect';
import { HttpError } from 'http-errors';

dotenv.config();

connectDB();

process.on('unhandledRejection', (err: HttpError) => {
  console.log('Unhandled Rejection, shutting down');
  console.log(err.name, err.message, err);
});

const port = (process.env.PORT as number | undefined) || 5000;

const server = app.listen(port, () => {
  console.log(`server running on port 5000 http://127.0.0.1:${port}`);
});

process.on('uncaughtException', (err: HttpError) => {
  console.log('uncaught exception, shutting down ...');
  console.log(err.name, err.message, err);
  server.close(() => {
    process.exit(1);
  });
});
