const Client = require('../../models/Client');

async function getClientByIdService(clientId) {
  try {
    const client = await Client.findById(clientId);
    return client;
  } catch (error) {
    throw new Error('Failed to get client by ID');
  }
}

module.exports = getClientByIdService;

