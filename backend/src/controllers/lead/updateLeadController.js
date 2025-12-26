const updateLeadService = require('../../services/lead/updateLeadService');
const getLeadByIdService = require('../../services/lead/getLeadByIdService');

async function updateLeadController(req, res, next) {
  try {
    const { id } = req.params;
    const user = req.user;
    const existing = await getLeadByIdService(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Lead not found' });
    if (user.role === 'ADMIN') {
      const hasAccess = user.managedClientIds.some((cid) => cid.toString() === existing.clientId.toString());
      if (!hasAccess) return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    if (user.role === 'CLIENT') {
      if (!user.clientId || user.clientId.toString() !== existing.clientId.toString()) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
    }
    const lead = await updateLeadService(id, req.body);
    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
}

module.exports = updateLeadController;
