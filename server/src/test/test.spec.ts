import mongoose from 'mongoose';
import User from '../models/user';
import { App } from '../app';
import * as dotenv from 'dotenv';
import { AuthController } from '../controllers/auth';
import { TokenController } from '../controllers/token';
import { UserController } from '../controllers/user';
import { PasswordController } from '../controllers/password';
// import '../controllers/token/token.spec';
console.log(`---------- STARTING --------------`);

dotenv.config();

const connectDB = async () => {
  await mongoose.createConnection(url, options);
  await User.deleteMany({});
};
process.env.NODE_ENV = 'test';
const app = new App([
  new AuthController(),
  new TokenController(),
  new UserController(),
  new PasswordController(),
]);

app.listen();

const url = `mongodb://localhost:${process.env.MONGO_PORT}/${process.env.MONGO_DB_TEST}`;
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

connectDB();
