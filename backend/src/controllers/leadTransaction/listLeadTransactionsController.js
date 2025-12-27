const LeadTransaction = require('../../models/LeadTransaction');
const responseFormatter = require('../../utils/responseFormatter');

module.exports = async (req, res, next) => {
  try {
    const { id: leadId } = req.params;
    const items = await LeadTransaction.find({ leadId }).sort({ date: -1, createdAt: -1 });
    res.json(responseFormatter.success(items));
  } catch (err) {
    next(err);
  }
};
