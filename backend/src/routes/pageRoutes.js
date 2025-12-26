const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const createPageController = require('../controllers/page/createPageController');
const updatePageController = require('../controllers/page/updatePageController');
const deletePageController = require('../controllers/page/deletePageController');
const getPageByIdController = require('../controllers/page/getPageByIdController');
const getPageBySlugController = require('../controllers/page/getPageBySlugController');
const listPagesController = require('../controllers/page/listPagesController');

router.get('/public/:slug', getPageBySlugController);

router.use(authMiddleware);

router.get('/', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), listPagesController);
router.get('/:id', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), getPageByIdController);
router.post('/', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), createPageController);
router.put('/:id', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), updatePageController);
router.delete('/:id', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), deletePageController);

module.exports = router;
