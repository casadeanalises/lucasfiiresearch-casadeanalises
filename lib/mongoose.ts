import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI não está definido nas variáveis de ambiente');
}

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      const currentDb = mongoose.connection.db?.databaseName;
      if (currentDb !== 'casadeanalises') {
        await mongoose.disconnect();
      } else {
        return;
      }
    }

    const conn = await mongoose.connect(MONGODB_URI, {
      dbName: 'casadeanalises', // Força o uso do banco casadeanalises
    });

    console.log('MongoDB Conectado:', {
      host: conn.connection.host,
      database: conn.connection.db?.databaseName
    });

  } catch (error) {
    console.error("Erro ao conectar com MongoDB:", error);
    throw error;
  }
};
