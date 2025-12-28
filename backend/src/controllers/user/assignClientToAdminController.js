const assignClientToAdminService = require('../../services/user/assignClientToAdminService');
const createAuditLogService = require('../../services/audit/createAuditLogService');

async function assignClientToAdminController(req, res, next) {
  try {
    const { adminId, clientId } = req.params;

    const updatedAdmin = await assignClientToAdminService(adminId, clientId);

    await createAuditLogService({
      user: req.user,
      action: 'ASSIGN_CLIENT_TO_ADMIN',
      targetModel: 'User',
      targetId: adminId,
      details: { clientId },
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: 'Client assigned to admin successfully',
      data: updatedAdmin,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
}

module.exports = assignClientToAdminController;
