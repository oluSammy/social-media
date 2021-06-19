import mongoose from 'mongoose';
import colors from 'colors';

export const connectDB = async () => {
  const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  };

  try {
    await mongoose.connect(process.env.DB_URI as string, mongooseOptions);
    console.log(colors.bold.bgRed('🌿 Database connected to database 🤝'));
  } catch (e) {
    console.log(process.env.DB_URI as string);
    console.log(e);
    console.log(
      colors.bold.bgRed(
        `oops! 🚫 an error occurred, couldn't connect to DB 😭`
      )
    );
  }
};
