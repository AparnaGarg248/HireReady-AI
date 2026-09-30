const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log("----------------------------------------------------");
    console.log(" [MONGODB] MONGODB_URI is not set in backend/.env");
    console.log(" Add your MongoDB Atlas connection string to save data.");
    console.log("----------------------------------------------------");
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    isConnected = true;
    console.log(`[MONGODB] Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[MONGODB] Connection failed: ${error.message}`);
    return false;
  }
};

const getDBStatus = () => ({
  connected: isConnected,
});

module.exports = { connectDB, getDBStatus };
