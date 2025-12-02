const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const createCustomMetricFieldController = require('../controllers/customMetricField/createCustomMetricFieldController');
const listCustomMetricFieldsController = require('../controllers/customMetricField/listCustomMetricFieldsController');
const updateCustomMetricFieldController = require('../controllers/customMetricField/updateCustomMetricFieldController');
const deleteCustomMetricFieldController = require('../controllers/customMetricField/deleteCustomMetricFieldController');

// All custom metric field routes require authentication
router.use(authMiddleware);
router.use(roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'CLIENT']));

router.post('/', createCustomMetricFieldController);
router.get('/', listCustomMetricFieldsController);
router.put('/:id', updateCustomMetricFieldController);
router.delete('/:id', deleteCustomMetricFieldController);

module.exports = router;

