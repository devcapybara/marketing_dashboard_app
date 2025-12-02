const Client = require('../../models/Client');

async function createClientService(clientData) {
  try {
    const { name, companyName, contactEmail, createdBy } = clientData;

    const client = new Client({
      name,
      companyName,
      contactEmail,
      createdBy,
      status: 'ACTIVE',
    });

    await client.save();

    return client;
  } catch (error) {
    throw error;
  }
}

module.exports = createClientService;

