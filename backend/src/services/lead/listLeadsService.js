const Lead = require('../../models/Lead');

async function listLeadsService(clientId) {
  const leads = await Lead.find({ clientId }).sort({ createdAt: -1 });
  return leads;
}

module.exports = listLeadsService;
