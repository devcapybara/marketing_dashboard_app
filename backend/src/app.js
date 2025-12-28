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
const systemRoutes = require('./routes/systemRoutes');
const leadTransactionRoutes = require('./routes/leadTransactionRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');

// Import error handler
const errorHandler = require('./middleware/errorHandler');

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

// request metrics middleware
const { record: recordMetric } = require('./utils/requestMetrics');
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;
    const routeKey = `${req.method} ${req.route?.path || req.path}`;
    recordMetric(routeKey, res.statusCode, durationMs);
  });
  next();
});

// health check
app.get('/health', (req, res) => {
  const uptimeSeconds = process.uptime();
  const startedAt = new Date(Date.now() - uptimeSeconds * 1000).toISOString();
  const pkg = (() => {
    try { return require('../../package.json'); } catch { return { version: '0.0.0' }; }
  })();
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    uptimeSeconds,
    startedAt,
    version: pkg.version,
  });
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
app.use('/api/system', systemRoutes);
app.use('/api', leadTransactionRoutes);
app.use('/api/calculator-saves', calculatorRoutes);
app.use('/api/audit-logs', auditLogRoutes);

// Error handler middleware (must be last)
app.use(errorHandler);

module.exports = app;


