const getLeadByIdService = require('../../services/lead/getLeadByIdService');

async function getLeadDetailController(req, res, next) {
  try {
    const { id } = req.params;
    const user = req.user;
    const lead = await getLeadByIdService(id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    if (user.role === 'ADMIN') {
      const hasAccess = user.managedClientIds.some((cid) => cid.toString() === lead.clientId.toString());
      if (!hasAccess) return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    if (user.role === 'CLIENT') {
      if (!user.clientId || user.clientId.toString() !== lead.clientId.toString()) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
    }
    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
}

module.exports = getLeadDetailController;
