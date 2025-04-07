import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/casadeanalises";

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }
    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error("Erro ao conectar com MongoDB:", error);
    throw error;
  }
};
