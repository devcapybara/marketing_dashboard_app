const bcrypt = require('bcryptjs');

async function hashPasswordService(plainPassword) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Password hashing failed');
  }
}

module.exports = hashPasswordService;

