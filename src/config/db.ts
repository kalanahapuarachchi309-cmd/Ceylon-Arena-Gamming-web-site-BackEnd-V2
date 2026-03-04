import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const db = await mongoose.connect(MONGO_URI, {
    bufferCommands: false,
  });

  isConnected = db.connections[0].readyState === 1;

  console.log("✅ MongoDB Connected");
};

export default connectDB;
