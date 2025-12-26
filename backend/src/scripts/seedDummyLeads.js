const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const config = require('../config/env');
const User = require('../models/User');
const Lead = require('../models/Lead');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

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

    const names = ['Andi','Budi','Citra','Dewi','Eka','Fajar','Gita','Hadi','Indra','Joko','Kiki','Lia','Made','Nina','Oka','Putra','Qori','Rani','Sari','Tono','Umar','Vina','Wulan','Yani','Zaki'];
    const sources = ['Google Ads','TikTok Ads','Facebook','Instagram','Teman','Pelanggan Lama','Organik'];
    const statuses = ['Tidak ada balasan','Masih tanya-tanya','Potensial','Closing','Retensi'];
    const pick = (arr) => arr[Math.floor(Math.random()*arr.length)];

    const payloads = Array.from({ length: 50 }).map((_, i) => ({
      clientId,
      name: `${pick(names)} ${i+1}`,
      phone: `08${Math.floor(100000000 + Math.random()*899999999)}`,
      username: `user_${i+1}`,
      csPic: '',
      source: pick(sources),
      address: 'Alamat',
      notes: 'Catatan',
      status: pick(statuses),
      createdBy: clientUser._id,
    }));

    await Lead.insertMany(payloads);
    console.log('✅ Inserted 50 dummy leads for client@marketing.com');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding dummy leads:', err.message);
    try { await mongoose.disconnect(); } catch {}
    process.exit(1);
  }
}

run();
