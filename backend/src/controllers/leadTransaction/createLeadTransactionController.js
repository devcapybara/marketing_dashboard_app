const LeadTransaction = require('../../models/LeadTransaction');
const Lead = require('../../models/Lead');
const responseFormatter = require('../../utils/responseFormatter');

module.exports = async (req, res, next) => {
  try {
    const { id: leadId } = req.params;
    const { date, product, amount, paymentMethod, attachment } = req.body;
    const lead = await Lead.findById(leadId);
    if (!lead) return res.status(404).json(responseFormatter.error('Lead not found'));
    const tx = await LeadTransaction.create({
      leadId,
      clientId: lead.clientId,
      date,
      product,
      amount,
      paymentMethod,
      attachment,
      createdBy: req.user?._id,
    });
    res.json(responseFormatter.success(tx));
  } catch (err) {
    next(err);
  }
};
