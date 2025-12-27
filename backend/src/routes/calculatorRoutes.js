const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const listController = require('../controllers/calculatorSave/listCalculatorSavesController');
const createController = require('../controllers/calculatorSave/createCalculatorSaveController');
const getController = require('../controllers/calculatorSave/getCalculatorSaveController');
const updateController = require('../controllers/calculatorSave/updateCalculatorSaveController');
const deleteController = require('../controllers/calculatorSave/deleteCalculatorSaveController');

router.get('/', authMiddleware, roleMiddleware(['SUPER_ADMIN','ADMIN','CLIENT']), listController);
router.post('/', authMiddleware, roleMiddleware(['SUPER_ADMIN','ADMIN','CLIENT']), createController);
router.get('/:id', authMiddleware, roleMiddleware(['SUPER_ADMIN','ADMIN','CLIENT']), getController);
router.put('/:id', authMiddleware, roleMiddleware(['SUPER_ADMIN','ADMIN','CLIENT']), updateController);
router.delete('/:id', authMiddleware, roleMiddleware(['SUPER_ADMIN','ADMIN','CLIENT']), deleteController);

module.exports = router;
