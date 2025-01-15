const mongoose = require("mongoose");
const logger = require("../utils/logger");
const { MONGO_URI } = require("./envConfig");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URI);
    logger.info(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
  }
};

module.exports = connectDB;
