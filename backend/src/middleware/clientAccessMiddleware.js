async function clientAccessMiddleware(req, res, next) {
  try {
    const user = req.user;
    const requestedClientId = req.params.clientId || req.query.clientId || req.body.clientId;

    // SUPER_ADMIN can access all clients
    if (user.role === 'SUPER_ADMIN') {
      return next();
    }

    // CLIENT can only access their own data
    if (user.role === 'CLIENT') {
      if (!user.clientId) {
        return res.status(403).json({
          success: false,
          message: 'Client ID not assigned to this user.',
        });
      }

      if (requestedClientId && requestedClientId.toString() !== user.clientId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only access your own data.',
        });
      }

      // Set clientId from user if not provided
      if (!requestedClientId) {
        req.clientId = user.clientId;
      }

      return next();
    }

    // ADMIN can access clients they manage
    if (user.role === 'ADMIN') {
      if (!requestedClientId) {
        return res.status(400).json({
          success: false,
          message: 'Client ID is required.',
        });
      }

      const hasAccess = user.managedClientIds.some(
        (id) => id.toString() === requestedClientId.toString()
      );

      if (!hasAccess && user.managedClientIds.length > 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You do not have permission to access this client.',
        });
      }

      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied.',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = clientAccessMiddleware;

