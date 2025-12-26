const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const config = require('../config/env');
const User = require('../models/User');
const AdAccount = require('../models/AdAccount');
const DailyMetric = require('../models/DailyMetric');
const Topup = require('../models/Topup');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function randomDateDec2025() {
  const day = randInt(1, 31);
  return new Date(2025, 11, day); // Month index 11 = December
}

async function run() {
  try {
    const uri = config.mongoUri || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/marketing_dashboard';
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

    const clientUser = await User.findOne({ email: 'client@marketing.com', role: 'CLIENT' });
    if (!clientUser || !clientUser.clientId) {
      console.error('Client user client@marketing.com not found or missing clientId');
      process.exit(1);
    }

    const clientId = clientUser.clientId;
    const accounts = await AdAccount.find({ clientId, isActive: true });
    if (accounts.length === 0) {
      console.error('No active ad accounts found for client');
      process.exit(1);
    }

    const paymentMethods = ['BANK_TRANSFER','CREDIT_CARD','E_WALLET','OTHER'];

    const dates = Array.from({ length: 31 }).map((_, i) => new Date(2025, 11, i + 1));
    const existing = await DailyMetric.find({ clientId, date: { $gte: new Date(2025,11,1), $lte: new Date(2025,11,31) } }, { adAccountId: 1, date: 1 }).lean();
    const used = new Set(existing.map((m) => `${m.adAccountId.toString()}_${new Date(m.date).toISOString().slice(0,10)}`));
    const metricsPayloads = [];
    let i = 0; let guard = 0;
    while (metricsPayloads.length < 50 && guard < 500) {
      const acc = accounts[i % accounts.length];
      let date = dates[(i + guard) % dates.length];
      const key = `${acc._id.toString()}_${date.toISOString().slice(0,10)}`;
      if (!used.has(key)) {
        used.add(key);
        const spend = randInt(50000, 2000000);
        const revenue = Math.round(spend * (Math.random() * 2 + 0.5));
        const impressions = randInt(1000, 100000);
        const clicks = randInt(Math.max(10, Math.floor(impressions * 0.02)), Math.max(20, Math.floor(impressions * 0.08)));
        const leads = randInt(0, 50);
        metricsPayloads.push({
          clientId,
          adAccountId: acc._id,
          platform: acc.platform,
          date,
          spend,
          revenue,
          impressions,
          clicks,
          leads,
          notes: 'Seed December 2025',
          createdBy: clientUser._id,
        });
      }
      i++; guard++;
    }

    const topupPayloads = Array.from({ length: 50 }).map(() => {
      const acc = randPick(accounts);
      const amount = randInt(100000, 10000000);
      return {
        clientId,
        adAccountId: acc._id,
        platform: acc.platform,
        date: randomDateDec2025(),
        amount,
        paymentMethod: randPick(paymentMethods),
        notes: 'Seed December 2025',
        receiptUrl: '',
        createdBy: clientUser._id,
      };
    });

    await DailyMetric.insertMany(metricsPayloads);
    await Topup.insertMany(topupPayloads);
    console.log('✅ Inserted 50 daily metrics and 50 topups for Dec 2025 (client@marketing.com)');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding metrics/topups:', err.message);
    try { await mongoose.disconnect(); } catch {}
    process.exit(1);
  }
}

run();
