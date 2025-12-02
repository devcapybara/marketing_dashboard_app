const createTopupService = require('../../services/topup/createTopupService');

async function createTopupController(req, res, next) {
  try {
    const {
      clientId,
      adAccountId,
      platform,
      date,
      amount,
      paymentMethod,
      notes,
      receiptUrl,
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

    if (!targetClientId || !adAccountId || !platform || !date || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'clientId, adAccountId, platform, date, and amount are required',
      });
    }

    const topupData = {
      clientId: targetClientId,
      adAccountId,
      platform,
      date,
      amount,
      paymentMethod,
      notes,
      receiptUrl,
      createdBy: user._id,
    };

    const newTopup = await createTopupService(topupData);

    return res.status(201).json({
      success: true,
      message: 'Topup created successfully',
      data: newTopup,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = createTopupController;

