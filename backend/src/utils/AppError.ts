// sets a base class to handle error in my app
class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: true;
  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('404') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
