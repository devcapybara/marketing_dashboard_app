const User = require('../../models/User');

async function findUserByEmailService(email) {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    return user;
  } catch (error) {
    throw new Error('Failed to find user by email');
  }
}

module.exports = findUserByEmailService;

