const updateLeadSettingsService = require('../../services/client/updateLeadSettingsService');

async function updateLeadSettingsController(req, res, next) {
  try {
    const { id } = req.params;
    const user = req.user;
    if (user.role === 'CLIENT') {
      if (!user.clientId || user.clientId.toString() !== id.toString()) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
    }
    if (user.role === 'ADMIN') {
      const hasAccess = user.managedClientIds.some((cid) => cid.toString() === id.toString());
      if (!hasAccess) return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const updated = await updateLeadSettingsService(id, req.body);
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

module.exports = updateLeadSettingsController;
