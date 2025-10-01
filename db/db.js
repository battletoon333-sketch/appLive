const mongoose = require('mongoose');

const connectDB = async (DB_URL) => {
  try {
    console.log("Connecting to MongoDB...", DB_URL);
    await mongoose.connect(DB_URL);
    console.log("Connected to MongoDB!!!!!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

module.exports = connectDB;