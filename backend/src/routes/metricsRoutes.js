const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const createDailyMetricController = require('../controllers/metrics/createDailyMetricController');
const listDailyMetricsController = require('../controllers/metrics/listDailyMetricsController');
const getDailyMetricDetailController = require('../controllers/metrics/getDailyMetricDetailController');
const updateDailyMetricController = require('../controllers/metrics/updateDailyMetricController');
const deleteDailyMetricController = require('../controllers/metrics/deleteDailyMetricController');

// All metrics routes require authentication
router.use(authMiddleware);
router.use(roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'CLIENT']));

router.post('/daily', createDailyMetricController);
router.get('/daily', listDailyMetricsController);
router.get('/daily/:id', getDailyMetricDetailController);
router.put('/daily/:id', updateDailyMetricController);
router.delete('/daily/:id', deleteDailyMetricController);

module.exports = router;

