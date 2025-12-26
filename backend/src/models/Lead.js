const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    username: { type: String, trim: true },
    csPic: { type: String, trim: true },
    source: { type: String, trim: true },
    address: { type: String, trim: true },
    notes: { type: String, trim: true },
    status: { type: String, trim: true },
    followUp1: { type: Date },
    followUp2: { type: Date },
    followUp3: { type: Date },
    followUp4: { type: Date },
    followUp5: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

leadSchema.index({ clientId: 1, createdAt: -1 });

module.exports = mongoose.model('Lead', leadSchema);

