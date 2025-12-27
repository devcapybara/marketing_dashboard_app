const mongoose = require('mongoose');

const leadTransactionSchema = new mongoose.Schema(
  {
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    date: { type: Date, required: true },
    product: { type: String, trim: true, required: true },
    amount: { type: Number, min: 0, required: true },
    paymentMethod: { type: String, trim: true },
    attachment: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

leadTransactionSchema.index({ leadId: 1, date: -1 });

module.exports = mongoose.model('LeadTransaction', leadTransactionSchema);
