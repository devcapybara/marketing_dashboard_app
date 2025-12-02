const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Client = require('../models/Client');
const hashPasswordService = require('../services/auth/hashPasswordService');
const config = require('../config/env');

dotenv.config();

async function seedUsers() {
  try {
    // Check if MONGO_URI is set
    if (!config.mongoUri) {
      console.error('❌ Error: MONGO_URI is not set in environment variables.');
      console.error('Please set MONGO_URI in your .env file with your MongoDB Atlas connection string.');
      console.error('Example: MONGO_URI=mongodb+srv://user:password@cluster0.xxxx.mongodb.net/marketing_dashboard');
      process.exit(1);
    }

    // Validate MONGO_URI format
    if (!config.mongoUri.includes('mongodb')) {
      console.error('❌ Error: MONGO_URI format is invalid.');
      console.error('MONGO_URI should start with mongodb:// or mongodb+srv://');
      process.exit(1);
    }

    // Check if MONGO_URI has hostname (basic validation)
    const uriMatch = config.mongoUri.match(/mongodb\+?srv?:\/\/([^@]+@)?([^\/]+)/);
    if (!uriMatch || !uriMatch[2] || uriMatch[2].trim() === '') {
      console.error('❌ Error: MONGO_URI appears to be incomplete.');
      console.error('MONGO_URI should include the full connection string with hostname.');
      console.error('Current MONGO_URI (first 50 chars):', config.mongoUri.substring(0, 50));
      console.error('\nPlease check your .env file and ensure MONGO_URI is complete.');
      console.error('Format: mongodb+srv://username:password@cluster.mongodb.net/database');
      process.exit(1);
    }

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    console.log(`MONGO_URI: ${config.mongoUri.substring(0, 20)}...`);
    
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    
    console.log('✅ Connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'SUPER_ADMIN' });
    if (existingSuperAdmin) {
      console.log('Super admin already exists. Skipping seed.');
      await mongoose.disconnect();
      return;
    }

    // Create Super Admin
    const superAdminPassword = await hashPasswordService('admin123');
    const superAdmin = new User({
      name: 'Super Admin',
      email: 'superadmin@marketing.com',
      passwordHash: superAdminPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
    });
    await superAdmin.save();
    console.log('✅ Super Admin created:');
    console.log('   Email: superadmin@marketing.com');
    console.log('   Password: admin123');

    // Create a sample client first (for admin and client user)
    const client = new Client({
      name: 'Sample Client',
      companyName: 'Sample Company',
      contactEmail: 'client@sample.com',
      status: 'ACTIVE',
      createdBy: superAdmin._id,
    });
    await client.save();
    console.log('✅ Sample Client created');

    // Create Admin User
    const adminPassword = await hashPasswordService('admin123');
    const admin = new User({
      name: 'Admin User',
      email: 'admin@marketing.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      managedClientIds: [client._id],
      isActive: true,
    });
    await admin.save();
    console.log('✅ Admin User created:');
    console.log('   Email: admin@marketing.com');
    console.log('   Password: admin123');

    // Create Client User
    const clientPassword = await hashPasswordService('client123');
    const clientUser = new User({
      name: 'Client User',
      email: 'client@marketing.com',
      passwordHash: clientPassword,
      role: 'CLIENT',
      clientId: client._id,
      isActive: true,
    });
    await clientUser.save();
    console.log('✅ Client User created:');
    console.log('   Email: client@marketing.com');
    console.log('   Password: client123');

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('SUPER_ADMIN:');
    console.log('   Email: superadmin@marketing.com');
    console.log('   Password: admin123');
    console.log('\nADMIN:');
    console.log('   Email: admin@marketing.com');
    console.log('   Password: admin123');
    console.log('\nCLIENT:');
    console.log('   Email: client@marketing.com');
    console.log('   Password: client123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding users:');
    
    if (error.code === 'EBADNAME' || error.message.includes('querySrv')) {
      console.error('   MongoDB connection string is invalid or incomplete.');
      console.error('   Please check your MONGO_URI in .env file.');
      console.error('   Make sure it includes the full connection string from MongoDB Atlas.');
    } else if (error.message.includes('authentication failed')) {
      console.error('   MongoDB authentication failed.');
      console.error('   Please check your username and password in MONGO_URI.');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('   Cannot connect to MongoDB server.');
      console.error('   Please check your internet connection and MongoDB Atlas cluster status.');
    } else {
      console.error('   Error details:', error.message);
    }
    
    console.error('\nFull error:', error);
    
    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      // Ignore disconnect errors
    }
    
    process.exit(1);
  }
}

seedUsers();

