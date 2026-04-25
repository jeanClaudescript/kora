const express = require('express');
const { listThreads } = require('../controllers/thread.controller');

const router = express.Router();
router.get('/threads', listThreads);

module.exports = router;
