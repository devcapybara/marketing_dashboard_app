function accessControl(options = {}) {
  return function (req, res, next) {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    const roles = options.roles || null;
    const requireClientAccess = options.client === true;
    if (roles && !roles.includes(user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    if (!requireClientAccess) {
      return next();
    }
    const requestedClientId =
      req.params && (req.params.clientId || req.params.id) ||
      req.query && req.query.clientId ||
      req.body && req.body.clientId ||
      req.clientId;
    if (user.role === 'SUPER_ADMIN') {
      return next();
    }
    if (user.role === 'CLIENT') {
      if (!user.clientId) {
        return res.status(403).json({ success: false, message: 'Access denied.' });
      }
      if (requestedClientId && requestedClientId.toString() !== user.clientId.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied.' });
      }
      if (!requestedClientId) {
        req.clientId = user.clientId;
      }
      return next();
    }
    if (user.role === 'ADMIN') {
      if (!requestedClientId) {
        return res.status(400).json({ success: false, message: 'Client ID is required.' });
      }
      const hasAccess = Array.isArray(user.managedClientIds) &&
        user.managedClientIds.some((id) => id.toString() === requestedClientId.toString());
      if (!hasAccess && user.managedClientIds && user.managedClientIds.length > 0) {
        return res.status(403).json({ success: false, message: 'Access denied.' });
      }
      return next();
    }
    return res.status(403).json({ success: false, message: 'Access denied.' });
  };
}

module.exports = accessControl;
