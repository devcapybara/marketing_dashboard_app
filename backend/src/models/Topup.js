const mongoose = require('mongoose');

const topupSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Client ID is required'],
    },
    adAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdAccount',
      required: [true, 'Ad Account ID is required'],
    },
    platform: {
      type: String,
      enum: ['META', 'TIKTOK', 'GOOGLE', 'X', 'LINKEDIN', 'OTHER'],
      required: [true, 'Platform is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['BANK_TRANSFER', 'CREDIT_CARD', 'E_WALLET', 'OTHER'],
      default: 'BANK_TRANSFER',
    },
    notes: {
      type: String,
      trim: true,
    },
    receiptUrl: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
topupSchema.index({ clientId: 1, date: -1 });
topupSchema.index({ adAccountId: 1, date: -1 });
topupSchema.index({ platform: 1, date: -1 });
topupSchema.index({ clientId: 1, platform: 1, date: -1 });

module.exports = mongoose.model('Topup', topupSchema);

