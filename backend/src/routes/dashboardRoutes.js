const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const getSuperAdminSummaryController = require('../controllers/dashboard/getSuperAdminSummaryController');
const getAdminSummaryController = require('../controllers/dashboard/getAdminSummaryController');
const getClientSummaryController = require('../controllers/dashboard/getClientSummaryController');

// All dashboard routes require authentication
router.use(authMiddleware);

router.get(
  '/super-admin',
  roleMiddleware(['SUPER_ADMIN']),
  getSuperAdminSummaryController
);

router.get(
  '/admin',
  roleMiddleware(['ADMIN']),
  getAdminSummaryController
);

router.get(
  '/client',
  roleMiddleware(['CLIENT']),
  getClientSummaryController
);

module.exports = router;

