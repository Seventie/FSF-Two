import mongoose from 'mongoose';

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('Missing MONGO_URI in server/.env');
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
};
