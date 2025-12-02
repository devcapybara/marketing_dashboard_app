const listAdminUsersService = require('../../services/user/listAdminUsersService');

async function listAdminUsersController(req, res, next) {
  try {
    const admins = await listAdminUsersService();
    return res.status(200).json({
      success: true,
      message: 'Admin users retrieved successfully',
      data: admins,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = listAdminUsersController;