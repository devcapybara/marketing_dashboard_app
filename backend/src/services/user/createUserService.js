const User = require('../../models/User');
const hashPasswordService = require('../auth/hashPasswordService');

async function createUserService(userData) {
  try {
    const { name, email, password, role, clientId, managedClientIds } = userData;

    // Hash password
    const passwordHash = await hashPasswordService(password);

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      clientId: clientId || null,
      managedClientIds: managedClientIds || [],
    });

    await user.save();

    // Remove passwordHash from response
    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    return userResponse;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Email already exists');
    }
    throw error;
  }
}

module.exports = createUserService;

