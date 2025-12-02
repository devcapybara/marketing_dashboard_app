const assignClientToAdminService = require('../../services/user/assignClientToAdminService');

async function assignClientToAdminController(req, res, next) {
  try {
    const { adminId, clientId } = req.params;

    const updatedAdmin = await assignClientToAdminService(adminId, clientId);

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