const express = require('express');
const middlewares = require('../middlewares');
const controllers = require('../controllers');
const router = express.Router();

router.use(middlewares.session);
router.use(middlewares.urlencoded);

router.get('/', controllers.web.index);
router.post('/order', controllers.web.order);

module.exports = router;
