const updateAdAccountService = require('../../services/adAccount/updateAdAccountService');
const getAdAccountByIdService = require('../../services/adAccount/getAdAccountByIdService');

async function updateAdAccountController(req, res, next) {
  try {
    const { id } = req.params;
    const { platform, accountName, accountId, currency, isActive, clientId, vatPercent } = req.body;
    const user = req.user;

    // Fetch existing ad account for RBAC checks
    const existingAdAccount = await getAdAccountByIdService(id);
    if (!existingAdAccount) {
      return res.status(404).json({
        success: false,
        message: 'Ad account not found',
      });
    }

    // RBAC: verify the user has access to this ad account and whether they can change clientId
    if (user.role === 'CLIENT') {
      if (existingAdAccount.clientId._id.toString() !== user.clientId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You do not have permission to update this ad account.',
        });
      }
      // CLIENT cannot change clientId
      if (clientId && clientId.toString() !== existingAdAccount.clientId._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'CLIENT is not allowed to reassign ad account to another client.',
        });
      }
    } else if (user.role === 'ADMIN') {
      const hasAccess = user.managedClientIds.some(
        (idVal) => idVal.toString() === existingAdAccount.clientId._id.toString()
      );
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You do not have permission to update this ad account.',
        });
      }
      // ADMIN can only reassign to clients they manage
      if (clientId && !user.managedClientIds.some((idVal) => idVal.toString() === clientId.toString())) {
        return res.status(403).json({
          success: false,
          message: 'ADMIN is not allowed to reassign ad account to a client you do not manage.',
        });
      }
    } else if (user.role === 'SUPER_ADMIN') {
      // SUPER_ADMIN can update freely, including client reassignment
    }

    const adAccountData = {
      platform,
      accountName,
      accountId,
      currency,
      isActive,
      vatPercent,
      // Only include clientId if provided (and valid by RBAC above)
      clientId,
    };

    const updatedAdAccount = await updateAdAccountService(id, adAccountData);

    return res.status(200).json({
      success: true,
      message: 'Ad account updated successfully',
      data: updatedAdAccount,
    });
  } catch (error) {
    if (error.message === 'Ad account not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}

module.exports = updateAdAccountController;

