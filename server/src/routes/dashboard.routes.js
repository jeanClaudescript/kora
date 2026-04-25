const express = require('express');
const { customerDashboard, businessDashboard } = require('../controllers/dashboard.controller');

const router = express.Router();

router.get('/dashboard/customer', customerDashboard);
router.get('/dashboard/business', businessDashboard);

module.exports = router;
