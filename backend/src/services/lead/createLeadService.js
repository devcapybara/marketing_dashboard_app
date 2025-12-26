const Lead = require('../../models/Lead');

async function createLeadService(payload, userId) {
  const lead = await Lead.create({ ...payload, createdBy: userId });
  return lead;
}

module.exports = createLeadService;
