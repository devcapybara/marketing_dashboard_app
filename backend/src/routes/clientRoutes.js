const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const clientAccessMiddleware = require('../middleware/clientAccessMiddleware');

const createClientController = require('../controllers/client/createClientController');
const getClientDetailController = require('../controllers/client/getClientDetailController');
const listClientsController = require('../controllers/client/listClientsController');
const updateClientController = require('../controllers/client/updateClientController');
const deleteClientController = require('../controllers/client/deleteClientController');
const updateLeadSettingsController = require('../controllers/client/updateLeadSettingsController');

// All client routes require authentication
router.use(authMiddleware);

// Create client - SUPER_ADMIN and ADMIN only
router.post(
  '/',
  roleMiddleware(['SUPER_ADMIN', 'ADMIN']),
  createClientController
);

// List clients - All authenticated users
router.get('/', listClientsController);

// Get client detail - All authenticated users
router.get('/:id', clientAccessMiddleware, getClientDetailController);

// Update client - SUPER_ADMIN and ADMIN only
router.put(
  '/:id',
  roleMiddleware(['SUPER_ADMIN', 'ADMIN']),
  updateClientController
);

// Update lead settings (sources, statuses, cs PIC options) - SUPER_ADMIN, ADMIN, CLIENT
router.put(
  '/:id/lead-settings',
  roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'CLIENT']),
  updateLeadSettingsController
);

// Delete client - SUPER_ADMIN and ADMIN only
router.delete(
  '/:id',
  roleMiddleware(['SUPER_ADMIN', 'ADMIN']),
  deleteClientController
);

module.exports = router;

