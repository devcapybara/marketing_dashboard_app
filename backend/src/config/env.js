const dotenv = require('dotenv');

dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  // gunakan MongoDB Atlas, wajib isi MONGO_URI di environment kamu
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me',
  nodeEnv: process.env.NODE_ENV || 'development',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};

module.exports = config;


