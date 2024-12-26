import mongoose from 'mongoose';
import { Db } from 'mongodb';
import config from '../../config';

export default async (): Promise<Db> => {
  try{
  const connection = await mongoose.connect(config.databaseURL);
  return connection.connection.db;
  } catch (error) {
    throw new Error(`Error while connecting to MongoDB: ${error}`);
  }
};
