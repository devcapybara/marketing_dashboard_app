const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const config = require('../config/env');
const User = require('../models/User');
const Lead = require('../models/Lead');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

async function run() {
  try {
    const uri = config.mongoUri || process.env.MONGO_URI;
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    const user = await User.findOne({ email: 'client@marketing.com' });
    console.log('clientId:', user?.clientId?.toString());
    const count = await Lead.countDocuments({ clientId: user.clientId });
    console.log('lead count:', count);
    const sample = await Lead.find({ clientId: user.clientId }).limit(3);
    console.log('sample:', sample.map(l=>({id:l._id.toString(), name:l.name, status:l.status})));
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error('err:', e.message);
    process.exit(1);
  }
}

run();
