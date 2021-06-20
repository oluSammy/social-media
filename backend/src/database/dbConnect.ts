import mongoose from 'mongoose';
import colors from 'colors';

export const connectDB = async () => {
  const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  };

  const uri = process.env.DB_URI as string;

  try {
    await mongoose.connect(uri, mongooseOptions);
    console.log(colors.bold.bgRed('🌿 app connected to database 🤝'));
  } catch (e) {
    console.log(e);
    console.log(
      colors.bold.bgRed(`oops! 🚫 an error occurred, couldn't connect to DB 😭`)
    );
  }
};
