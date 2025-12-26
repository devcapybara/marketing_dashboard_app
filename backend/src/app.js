const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const adAccountRoutes = require('./routes/adAccountRoutes');
const metricsRoutes = require('./routes/metricsRoutes');
const topupRoutes = require('./routes/topupRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const customMetricFieldRoutes = require('./routes/customMetricFieldRoutes');
const pageRoutes = require('./routes/pageRoutes');
const leadRoutes = require('./routes/leadRoutes');

// Import error handler
const errorHandler = require('./middleware/errorHandler');

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

// health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/ad-accounts', adAccountRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/topups', topupRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/custom-metric-fields', customMetricFieldRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/leads', leadRoutes);

// Error handler middleware (must be last)
app.use(errorHandler);

module.exports = app;


