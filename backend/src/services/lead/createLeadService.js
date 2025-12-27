const Lead = require('../../models/Lead');

async function createLeadService(payload, userId) {
  const next = (await Lead.countDocuments({ clientId: payload.clientId })) + 1;
  const lead = await Lead.create({ ...payload, counter: next, createdBy: userId });
  return lead;
}

module.exports = createLeadService;
