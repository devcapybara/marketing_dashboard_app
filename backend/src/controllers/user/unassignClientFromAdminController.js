const unassignClientFromAdminService = require('../../services/user/unassignClientFromAdminService');

async function unassignClientFromAdminController(req, res, next) {
  try {
    const { adminId, clientId } = req.params;

    const updatedAdmin = await unassignClientFromAdminService(adminId, clientId);

    return res.status(200).json({
      success: true,
      message: 'Client unassigned from admin successfully',
      data: updatedAdmin,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
}

module.exports = unassignClientFromAdminController;