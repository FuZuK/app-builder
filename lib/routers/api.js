const express = require('express');
const controllers = require('../controllers');
const middlewares = require('../middlewares');

const router = express.Router();

router.use(middlewares.json);
router.use(middlewares.urlencoded);

module.exports = router;
