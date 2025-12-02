const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const createAdminUserController = require('../controllers/user/createAdminUserController');
const createClientUserController = require('../controllers/user/createClientUserController');

// All user routes require authentication and SUPER_ADMIN role
router.use(authMiddleware);
router.use(roleMiddleware(['SUPER_ADMIN']));

router.post('/admin', createAdminUserController);
router.post('/client-user', createClientUserController);

module.exports = router;

