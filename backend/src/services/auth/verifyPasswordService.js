const bcrypt = require('bcryptjs');

async function verifyPasswordService(plainPassword, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error('Password verification failed');
  }
}

module.exports = verifyPasswordService;

