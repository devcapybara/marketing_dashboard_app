const listLeadsService = require('../../services/lead/listLeadsService');

async function listLeadsController(req, res, next) {
  try {
    const clientId = req.query.clientId || req.clientId;
    const leads = await listLeadsService(clientId);
    return res.status(200).json({ success: true, data: leads });
  } catch (error) {
    next(error);
  }
}

module.exports = listLeadsController;
