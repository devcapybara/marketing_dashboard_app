const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const clientAccessMiddleware = require('../middleware/clientAccessMiddleware');

const listLeadsController = require('../controllers/lead/listLeadsController');
const createLeadController = require('../controllers/lead/createLeadController');
const getLeadDetailController = require('../controllers/lead/getLeadDetailController');
const updateLeadController = require('../controllers/lead/updateLeadController');
const deleteLeadController = require('../controllers/lead/deleteLeadController');

router.get('/', authMiddleware, roleMiddleware(['SUPER_ADMIN','ADMIN','CLIENT']), listLeadsController);
router.post('/', authMiddleware, roleMiddleware(['SUPER_ADMIN','ADMIN','CLIENT']), clientAccessMiddleware, createLeadController);
router.get('/:id', authMiddleware, roleMiddleware(['SUPER_ADMIN','ADMIN','CLIENT']), getLeadDetailController);
router.put('/:id', authMiddleware, roleMiddleware(['SUPER_ADMIN','ADMIN','CLIENT']), updateLeadController);
router.delete('/:id', authMiddleware, roleMiddleware(['SUPER_ADMIN','ADMIN','CLIENT']), deleteLeadController);

module.exports = router;
