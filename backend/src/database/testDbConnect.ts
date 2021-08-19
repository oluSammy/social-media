import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export const testDbConnect = async () => {
  const mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  };

  await mongoose.connect(uri, mongooseOpts);

  console.log("connected to mongoose memory server");
};

export const dbDisconnect = async () => {
  //   const mongo = await MongoMemoryServer.create();

  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  //   await mongo.stop();
};
