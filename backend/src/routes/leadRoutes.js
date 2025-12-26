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

router.use(authMiddleware);

router.get('/', roleMiddleware(['SUPER_ADMIN','ADMIN','CLIENT']), clientAccessMiddleware, listLeadsController);
router.post('/', roleMiddleware(['SUPER_ADMIN','ADMIN','CLIENT']), clientAccessMiddleware, createLeadController);
router.get('/:id', roleMiddleware(['SUPER_ADMIN','ADMIN','CLIENT']), getLeadDetailController);
router.put('/:id', roleMiddleware(['SUPER_ADMIN','ADMIN','CLIENT']), updateLeadController);
router.delete('/:id', roleMiddleware(['SUPER_ADMIN','ADMIN','CLIENT']), deleteLeadController);

module.exports = router;
