const express = require('express');
const sync = require('./sync');
const search = require('./search');

const router = express.Router();

router.use('/', sync);
router.use('/', search);

module.exports = router;
