const listLeadsService = require('../../services/lead/listLeadsService');

async function listLeadsController(req, res, next) {
  try {
    const clientId = req.query.clientId || req.clientId || (req.user?.role === 'CLIENT' ? req.user?.clientId : undefined);
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '25');
    const search = req.query.search || '';
    const { leads, total } = await listLeadsService(clientId, { page, limit, search });
    return res.status(200).json({ success: true, data: leads, meta: { total, page, limit } });
  } catch (error) {
    next(error);
  }
}

module.exports = listLeadsController;
