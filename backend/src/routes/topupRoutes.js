const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const createTopupController = require('../controllers/topup/createTopupController');
const listTopupsController = require('../controllers/topup/listTopupsController');
const getTopupDetailController = require('../controllers/topup/getTopupDetailController');
const updateTopupController = require('../controllers/topup/updateTopupController');
const deleteTopupController = require('../controllers/topup/deleteTopupController');
const uploadReceiptController = require('../controllers/topup/uploadReceiptController');

// All topup routes require authentication
router.use(authMiddleware);
router.use(roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'CLIENT']));

router.post('/', createTopupController);
router.get('/', listTopupsController);
router.get('/:id', getTopupDetailController);
router.put('/:id', updateTopupController);
router.delete('/:id', deleteTopupController);
router.post('/upload-receipt', uploadReceiptController);

module.exports = router;

