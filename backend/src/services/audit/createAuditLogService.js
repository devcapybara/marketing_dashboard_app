const AuditLog = require('../../models/AuditLog');

async function createAuditLogService({
  user,
  action,
  targetModel,
  targetId,
  details = null,
  ipAddress = null,
}) {
  try {
    const userId =
      typeof user === 'string'
        ? user
        : user && user._id
        ? user._id
        : null;
    if (!userId) {
      // We can choose to throw an error or just log it and exit.
      // For critical logs, throwing is better.
      console.error('Audit log cannot be created without a valid user.');
      return;
    }
    if (!action || !targetModel || !targetId) {
      console.error(
        'Audit log requires action, targetModel, and targetId to be created.'
      );
      return;
    }
    const log = await AuditLog.create({
      user: userId,
      action,
      targetModel,
      targetId,
      details,
      ipAddress,
    });
    return log;
  } catch (err) {
    // Log the error for debugging purposes, but don't swallow it.
    // The calling service might want to know that the audit failed.
    console.error('Failed to create audit log:', err);
    // Re-throwing the error might be too aggressive as it could crash a parent operation
    // that was otherwise successful. For now, just logging the failure is a safer approach
    // than returning null silently. We are not re-throwing.
  }
}

module.exports = createAuditLogService;
