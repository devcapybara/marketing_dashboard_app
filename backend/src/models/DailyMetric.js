const mongoose = require('mongoose');

const dailyMetricSchema = new mongoose.Schema(
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
    spend: {
      type: Number,
      required: [true, 'Spend is required'],
      min: 0,
    },
    revenue: {
      type: Number,
      default: 0,
      min: 0,
    },
    impressions: {
      type: Number,
      default: 0,
      min: 0,
    },
    clicks: {
      type: Number,
      default: 0,
      min: 0,
    },
    leads: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Custom fields untuk extensibility
    // Format: { "fieldName": value }
    // Contoh: { "pageView": 100, "formConversions": 5, "waConversions": 10 }
    customFields: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    notes: {
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
dailyMetricSchema.index({ clientId: 1, date: -1 });
dailyMetricSchema.index({ adAccountId: 1, date: -1 });
dailyMetricSchema.index({ platform: 1, date: -1 });
dailyMetricSchema.index({ clientId: 1, platform: 1, date: -1 });

// Prevent duplicate entries for same client, account, and date
dailyMetricSchema.index({ clientId: 1, adAccountId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyMetric', dailyMetricSchema);

