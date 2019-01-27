const express = require('express');
const web = require('./routers/web');
const api = require('./routers/api');

const router = express.Router();

router.use('/', web);
router.use('/api', api);

module.exports = router;
