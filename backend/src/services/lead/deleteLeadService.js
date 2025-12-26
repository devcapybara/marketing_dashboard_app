const Lead = require('../../models/Lead');

async function deleteLeadService(id) {
  await Lead.findByIdAndDelete(id);
  return true;
}

module.exports = deleteLeadService;
