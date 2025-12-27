const mongoose = require('mongoose');

const calculatorSaveSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    productName: { type: String, trim: true },
    businessType: { type: String, enum: ['JASA','PRODUK_FISIK','PRODUK_DIGITAL'], required: true },
    hpp: { type: Number, default: 0 },
    marketingPercent: { type: Number, default: 0 },
    profitPercent: { type: Number, default: 0 },
    adminType: { type: String, enum: ['PERCENT','FIXED'], default: 'PERCENT' },
    adminValue: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    scaleBudget: { type: Number, default: 0 },
    affiliatePercent: { type: Number, default: 0 },
    targetNetIncome: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    bep: { type: Number, default: 0 },
    marketingBudget: { type: Number, default: 0 },
    cpaMax: { type: Number, default: 0 },
    roasTarget: { type: Number, default: 0 },
    priceAfterDiscount: { type: Number, default: 0 },
    netProfitAfterDiscount: { type: Number, default: 0 },
    estimatedOmset: { type: Number, default: 0 },
    estimatedSales: { type: Number, default: 0 },
    estimatedProfit: { type: Number, default: 0 },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

calculatorSaveSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('CalculatorSave', calculatorSaveSchema);
