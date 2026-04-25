const express = require('express');
const { login, signup, demo } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/auth/login', login);
router.post('/auth/signup', signup);
router.post('/auth/demo', demo);

module.exports = router;
