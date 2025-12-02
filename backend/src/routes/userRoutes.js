const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const createAdminUserController = require('../controllers/user/createAdminUserController');
const createClientUserController = require('../controllers/user/createClientUserController');
const listAdminUsersController = require('../controllers/user/listAdminUsersController');
const assignClientToAdminController = require('../controllers/user/assignClientToAdminController');
const unassignClientFromAdminController = require('../controllers/user/unassignClientFromAdminController');

// All user routes require authentication and SUPER_ADMIN role
router.use(authMiddleware);
router.use(roleMiddleware(['SUPER_ADMIN']));

router.post('/admin', createAdminUserController);
router.post('/client-user', createClientUserController);

// List admins
router.get('/admins', listAdminUsersController);

// Assign/unassign client to admin
router.post('/admin/:adminId/assign-client/:clientId', assignClientToAdminController);
router.post('/admin/:adminId/unassign-client/:clientId', unassignClientFromAdminController);

module.exports = router;

