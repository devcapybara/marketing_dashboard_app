const Client = require('../../models/Client');

async function updateLeadSettingsService(clientId, settings) {
  const client = await Client.findById(clientId);
  if (!client) throw new Error('Client not found');
  if (settings.leadSourceOptions) client.leadSourceOptions = settings.leadSourceOptions;
  if (settings.leadStatusOptions) client.leadStatusOptions = settings.leadStatusOptions;
  if (settings.csPicOptions) client.csPicOptions = settings.csPicOptions;
  await client.save();
  return client;
}

module.exports = updateLeadSettingsService;
