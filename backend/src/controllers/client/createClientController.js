const createClientService = require('../../services/client/createClientService');
const createAuditLogService = require('../../services/audit/createAuditLogService');

async function createClientController(req, res, next) {
  try {
    const { name, companyName, contactEmail } = req.body;
    const createdBy = req.user._id;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Client name is required',
      });
    }

    const clientData = {
      name,
      companyName,
      contactEmail,
      createdBy,
    };

    const newClient = await createClientService(clientData);

    await createAuditLogService({
      user: req.user,
      action: 'CREATE_CLIENT',
      targetModel: 'Client',
      targetId: newClient._id,
      details: { data: newClient },
      ipAddress: req.ip,
    });

    return res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: newClient,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = createClientController;

