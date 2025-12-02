const createAdAccountService = require('../../services/adAccount/createAdAccountService');

async function createAdAccountController(req, res, next) {
  try {
    const { clientId, platform, accountName, accountId, currency } = req.body;
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

    if (!targetClientId || !platform || !accountName || !accountId) {
      return res.status(400).json({
        success: false,
        message: 'clientId, platform, accountName, and accountId are required',
      });
    }

    const adAccountData = {
      clientId: targetClientId,
      platform,
      accountName,
      accountId,
      currency,
    };

    const newAdAccount = await createAdAccountService(adAccountData);

    return res.status(201).json({
      success: true,
      message: 'Ad account created successfully',
      data: newAdAccount,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = createAdAccountController;

