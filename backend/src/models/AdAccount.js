const mongoose = require('mongoose');

const adAccountSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Client ID is required'],
    },
    platform: {
      type: String,
      enum: ['META', 'TIKTOK', 'GOOGLE', 'X', 'LINKEDIN', 'OTHER'],
      required: [true, 'Platform is required'],
    },
    accountName: {
      type: String,
      required: [true, 'Account name is required'],
      trim: true,
    },
    accountId: {
      type: String,
      required: [true, 'Account ID is required'],
      trim: true,
    },
    currency: {
      type: String,
      default: 'IDR',
      uppercase: true,
      trim: true,
    },
    vatPercent: {
      type: Number,
      default: 11,
      min: 0,
      max: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
adAccountSchema.index({ clientId: 1 });
adAccountSchema.index({ platform: 1 });
adAccountSchema.index({ clientId: 1, platform: 1 });

module.exports = mongoose.model('AdAccount', adAccountSchema);

