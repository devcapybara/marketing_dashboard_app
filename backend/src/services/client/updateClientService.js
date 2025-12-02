const Client = require('../../models/Client');

async function updateClientService(clientId, clientData) {
  try {
    const { name, companyName, contactEmail, status } = clientData;

    const client = await Client.findById(clientId);

    if (!client) {
      throw new Error('Client not found');
    }

    if (name) client.name = name;
    if (companyName !== undefined) client.companyName = companyName;
    if (contactEmail !== undefined) client.contactEmail = contactEmail;
    if (status) client.status = status;

    await client.save();

    return client;
  } catch (error) {
    throw error;
  }
}

module.exports = updateClientService;

