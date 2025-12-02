const User = require('../../models/User');

async function listAdminUsersService() {
  try {
    const admins = await User.find({ role: 'ADMIN' })
      .select('name email role managedClientIds isActive createdAt lastLoginAt')
      .populate('managedClientIds', 'name companyName');
    return admins;
  } catch (error) {
    throw new Error('Failed to list admin users');
  }
}

module.exports = listAdminUsersService;