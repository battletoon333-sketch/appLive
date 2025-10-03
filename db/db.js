const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...", process.env.DB_URL);
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB!!!!!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

module.exports = connectDB;