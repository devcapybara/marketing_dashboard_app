const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const getApiMetricsController = require('../controllers/system/getApiMetricsController');

router.use(authMiddleware);

router.get('/metrics', roleMiddleware(['SUPER_ADMIN']), getApiMetricsController);

module.exports = router;
