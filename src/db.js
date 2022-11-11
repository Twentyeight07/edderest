import mongoose from 'mongoose';
import { MONGO_DB_URI } from './config.js';

mongoose
  .connect(MONGO_DB_URI, {
    useNewUrlParser: true,
  })
  .then((db) => console.log(`db is connected`))
  .catch((err) => console.log(err));
