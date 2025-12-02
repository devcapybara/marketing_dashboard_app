const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const createAdAccountController = require('../controllers/adAccount/createAdAccountController');
const listAdAccountsController = require('../controllers/adAccount/listAdAccountsController');
const getAdAccountDetailController = require('../controllers/adAccount/getAdAccountDetailController');
const updateAdAccountController = require('../controllers/adAccount/updateAdAccountController');
const deleteAdAccountController = require('../controllers/adAccount/deleteAdAccountController');

// All ad account routes require authentication
router.use(authMiddleware);
router.use(roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'CLIENT']));

router.post('/', createAdAccountController);
router.get('/', listAdAccountsController);
router.get('/:id', getAdAccountDetailController);
router.put('/:id', updateAdAccountController);
router.delete('/:id', deleteAdAccountController);

module.exports = router;

