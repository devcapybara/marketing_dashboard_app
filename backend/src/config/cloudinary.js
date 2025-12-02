const cloudinary = require('cloudinary').v2;
const config = require('./env');

if (!config.cloudinary.cloudName) {
  console.warn('Cloudinary is not fully configured. Please set CLOUDINARY_* env vars.');
}

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

module.exports = cloudinary;


