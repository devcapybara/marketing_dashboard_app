const Lead = require('../../models/Lead');

async function updateLeadService(id, payload) {
  const lead = await Lead.findByIdAndUpdate(id, payload, { new: true });
  return lead;
}

module.exports = updateLeadService;
