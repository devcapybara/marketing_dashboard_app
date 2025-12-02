const createDailyMetricService = require('../../services/metrics/createDailyMetricService');

async function createDailyMetricController(req, res, next) {
  try {
    const {
      clientId,
      adAccountId,
      platform,
      date,
      spend,
      revenue,
      impressions,
      clicks,
      leads,
      notes,
    } = req.body;

    const user = req.user;

    // Determine clientId based on user role
    let targetClientId = clientId;

    if (user.role === 'CLIENT') {
      targetClientId = user.clientId;
    } else if (user.role === 'ADMIN' && clientId) {
      // Verify admin has access to this client
      const hasAccess = user.managedClientIds.some(
        (id) => id.toString() === clientId.toString()
      );
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You do not have permission to access this client.',
        });
      }
    }

    if (!targetClientId || !adAccountId || !platform || !date || spend === undefined) {
      return res.status(400).json({
        success: false,
        message: 'clientId, adAccountId, platform, date, and spend are required',
      });
    }

    const metricData = {
      clientId: targetClientId,
      adAccountId,
      platform,
      date,
      spend,
      revenue,
      impressions,
      clicks,
      leads,
      notes,
      createdBy: user._id,
    };

    const newMetric = await createDailyMetricService(metricData);

    return res.status(201).json({
      success: true,
      message: 'Daily metric created successfully',
      data: newMetric,
    });
  } catch (error) {
    if (error.message.includes('already exists')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}

module.exports = createDailyMetricController;

