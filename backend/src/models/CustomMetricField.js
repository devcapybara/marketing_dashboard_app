const mongoose = require('mongoose');

const customMetricFieldSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Client ID is required'],
    },
    platform: {
      type: String,
      enum: ['META', 'TIKTOK', 'GOOGLE', 'X', 'LINKEDIN', 'OTHER', 'ALL'],
      default: 'ALL',
      required: true,
    },
    fieldName: {
      type: String,
      required: [true, 'Field name is required'],
      trim: true,
    },
    fieldLabel: {
      type: String,
      required: [true, 'Field label is required'],
      trim: true,
    },
    fieldType: {
      type: String,
      enum: ['NUMBER', 'TEXT', 'PERCENTAGE', 'CURRENCY'],
      default: 'NUMBER',
      required: true,
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    defaultValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
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
customMetricFieldSchema.index({ clientId: 1, platform: 1 });
customMetricFieldSchema.index({ clientId: 1, isActive: 1 });

module.exports = mongoose.model('CustomMetricField', customMetricFieldSchema);

