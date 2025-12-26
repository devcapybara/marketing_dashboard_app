const createLeadService = require('../../services/lead/createLeadService');

async function createLeadController(req, res, next) {
  try {
    const user = req.user;
    const payload = req.body;
    const lead = await createLeadService(payload, user._id);
    return res.status(201).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
}

module.exports = createLeadController;
