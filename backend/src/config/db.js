const mongoose = require('mongoose');
const config = require('./env');

async function connectDB() {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      // These options are recommended for Mongoose 6+
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;

