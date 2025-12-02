const jwt = require('jsonwebtoken');
const config = require('../../config/env');

function generateJwtService(userId) {
  if (!config.jwtSecret) {
    throw new Error('JWT_SECRET is not configured. Please set JWT_SECRET in your .env file.');
  }

  if (!userId) {
    throw new Error('User ID is required to generate JWT token');
  }

  // Convert to string if it's an ObjectId
  const userIdString = userId.toString ? userId.toString() : userId;

  const payload = {
    userId: userIdString,
  };

  const options = {
    expiresIn: '7d', // Token expires in 7 days
  };

  try {
    const token = jwt.sign(payload, config.jwtSecret, options);
    return token;
  } catch (error) {
    console.error('JWT generation error:', error);
    throw new Error('Failed to generate JWT token: ' + error.message);
  }
}

module.exports = generateJwtService;

