const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const listAuditLogsController = require('../controllers/audit/listAuditLogsController');

router.use(authMiddleware);

router.get('/', roleMiddleware(['SUPER_ADMIN']), listAuditLogsController);

module.exports = router;
