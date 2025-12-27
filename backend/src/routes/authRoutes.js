const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const loginController = require('../controllers/auth/loginController');
const getCurrentUserController = require('../controllers/auth/getCurrentUserController');
const registerController = require('../controllers/auth/registerController');

// Public routes
router.post('/login', loginController);
router.post('/register', registerController);

// Protected routes
router.get('/me', authMiddleware, getCurrentUserController);

module.exports = router;

