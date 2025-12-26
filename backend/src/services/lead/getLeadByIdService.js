const Lead = require('../../models/Lead');

async function getLeadByIdService(id) {
  const lead = await Lead.findById(id);
  return lead;
}

module.exports = getLeadByIdService;
