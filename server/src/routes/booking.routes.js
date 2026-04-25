const express = require('express');
const { create, byUser, businessList, updateStatus } = require('../controllers/booking.controller');

const router = express.Router();

router.post('/bookings', create);
router.get('/bookings/business', businessList);
router.patch('/bookings/business/:bookingId/status', updateStatus);
router.get('/bookings', byUser);

module.exports = router;
