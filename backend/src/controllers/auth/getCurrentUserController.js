async function getCurrentUserController(req, res, next) {
  try {
    const user = req.user;

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      clientId: user.clientId,
      managedClientIds: user.managedClientIds,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };

    return res.status(200).json({
      success: true,
      message: 'User data retrieved successfully',
      data: userData,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = getCurrentUserController;

