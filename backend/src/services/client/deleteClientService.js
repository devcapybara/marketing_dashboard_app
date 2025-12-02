const Client = require('../../models/Client');

async function deleteClientService(clientId) {
  try {
    const client = await Client.findById(clientId);

    if (!client) {
      throw new Error('Client not found');
    }

    await Client.findByIdAndDelete(clientId);

    return { message: 'Client deleted successfully' };
  } catch (error) {
    throw error;
  }
}

module.exports = deleteClientService;

