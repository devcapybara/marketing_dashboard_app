const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
      default: 'ACTIVE',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    leadSourceOptions: {
      type: [String],
      default: [
        'Google Ads',
        'TikTok Ads',
        'Facebook',
        'Instagram',
        'Teman',
        'Pelanggan Lama',
        'Organik',
      ],
    },
    leadStatusOptions: {
      type: [String],
      default: [
        'Tidak ada balasan',
        'Masih tanya-tanya',
        'Potensial',
        'Closing',
        'Retensi',
      ],
    },
    csPicOptions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
clientSchema.index({ status: 1 });
clientSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Client', clientSchema);

