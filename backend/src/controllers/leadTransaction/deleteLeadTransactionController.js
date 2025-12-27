const LeadTransaction = require('../../models/LeadTransaction');
const responseFormatter = require('../../utils/responseFormatter');

module.exports = async (req, res, next) => {
  try {
    const { txId } = req.params;
    const deleted = await LeadTransaction.findByIdAndDelete(txId);
    if (!deleted) return res.status(404).json(responseFormatter.error('Transaction not found'));
    res.json(responseFormatter.success({ id: txId }));
  } catch (err) {
    next(err);
  }
};
