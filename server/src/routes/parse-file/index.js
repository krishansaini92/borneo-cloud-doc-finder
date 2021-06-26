const express = require('express');
const sync = require('./sync');

const router = express.Router();

router.use('/', sync);

module.exports = router;
