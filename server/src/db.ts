import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

export class DB {
  private urlLocal = `mongodb://localhost:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
  private urlDocker = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
  private options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };
  constructor() {
    this.connectToDB();
  }

  private async connectToDB(): Promise<void> {
    mongoose.connect(this.urlDocker, this.options).then((conn) => {
      if (process.env.NODE_ENV !== 'test') {
        console.log(` 🏠 [database] connected to ${conn.connection.host}`);
        console.log(
          ` 💾 [connection] connected to ${process.env.NODE_ENV} database`
        );
        console.log(' 🛑 [stop] Press CTRL-C\n');
      }
    });
  }
}