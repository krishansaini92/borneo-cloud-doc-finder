const express = require('express');
const parseFileRoutes = require('./parse-file');

const router = express.Router();

/* This needs to be used to check if site is up. */
router.get('/', (_, res) => {
  res.json({ title: 'Borneo parse file service' });
});

router.use('/parse-file', parseFileRoutes);

module.exports = router;
