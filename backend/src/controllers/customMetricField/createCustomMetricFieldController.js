const createCustomMetricFieldService = require('../../services/customMetricField/createCustomMetricFieldService');

async function createCustomMetricFieldController(req, res, next) {
  try {
    const {
      clientId,
      platform,
      fieldName,
      fieldLabel,
      fieldType,
      isRequired,
      defaultValue,
      displayOrder,
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

    if (!targetClientId || !fieldName || !fieldLabel) {
      return res.status(400).json({
        success: false,
        message: 'clientId, fieldName, and fieldLabel are required',
      });
    }

    const fieldData = {
      clientId: targetClientId,
      platform: platform || 'ALL',
      fieldName,
      fieldLabel,
      fieldType: fieldType || 'NUMBER',
      isRequired: isRequired || false,
      defaultValue,
      displayOrder: displayOrder || 0,
      createdBy: user._id,
    };

    const newField = await createCustomMetricFieldService(fieldData);

    return res.status(201).json({
      success: true,
      message: 'Custom metric field created successfully',
      data: newField,
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

module.exports = createCustomMetricFieldController;

