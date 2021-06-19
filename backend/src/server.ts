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

const server = app.listen(5000, () => {
  console.log('server running on port 5000');
});

process.on('uncaughtException', (err: HttpError) => {
  console.log('uncaught exception, shutting down ...');
  console.log(err.name, err.message, err);
  server.close(() => {
    process.exit(1);
  });
});
