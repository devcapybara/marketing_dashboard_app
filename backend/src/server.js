const http = require('http');
const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/db');

async function start() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create HTTP server
    const server = http.createServer(app);

    // Start server
    server.listen(config.port, () => {
      console.log(`Backend server running on port ${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();


