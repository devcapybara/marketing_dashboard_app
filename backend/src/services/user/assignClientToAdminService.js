const User = require('../../models/User');
const Client = require('../../models/Client');

async function assignClientToAdminService(adminId, clientId) {
  try {
    if (!adminId || !clientId) {
      const err = new Error('adminId and clientId are required');
      err.statusCode = 400;
      throw err;
    }

    const admin = await User.findById(adminId);
    if (!admin) {
      const err = new Error('Admin user not found');
      err.statusCode = 404;
      throw err;
    }

    if (admin.role !== 'ADMIN') {
      const err = new Error('Target user must be an ADMIN');
      err.statusCode = 400;
      throw err;
    }

    const client = await Client.findById(clientId);
    if (!client) {
      const err = new Error('Client not found');
      err.statusCode = 404;
      throw err;
    }

    const alreadyAssigned = admin.managedClientIds.some(
      (id) => id.toString() === clientId.toString()
    );

    if (!alreadyAssigned) {
      admin.managedClientIds.push(clientId);
      await admin.save();
    }

    const adminResponse = admin.toObject();
    delete adminResponse.passwordHash;

    return adminResponse;
  } catch (error) {
    throw error;
  }
}

module.exports = assignClientToAdminService;