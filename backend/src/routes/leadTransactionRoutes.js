const express = require('express');
const router = express.Router({ mergeParams: true });
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const listLeadTransactionsController = require('../controllers/leadTransaction/listLeadTransactionsController');
const createLeadTransactionController = require('../controllers/leadTransaction/createLeadTransactionController');
const deleteLeadTransactionController = require('../controllers/leadTransaction/deleteLeadTransactionController');

router.get('/leads/:id/transactions', authMiddleware, roleMiddleware(['SUPER_ADMIN','ADMIN','CLIENT']), listLeadTransactionsController);
router.post('/leads/:id/transactions', authMiddleware, roleMiddleware(['SUPER_ADMIN','ADMIN','CLIENT']), createLeadTransactionController);
router.delete('/leads/:id/transactions/:txId', authMiddleware, roleMiddleware(['SUPER_ADMIN','ADMIN','CLIENT']), deleteLeadTransactionController);

module.exports = router;
