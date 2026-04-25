const express = require('express');
const { listListings, search, getBySlug } = require('../controllers/listing.controller');

const router = express.Router();

router.get('/listings', listListings);
router.get('/listings/search', search);
router.get('/listings/:slug', getBySlug);

module.exports = router;
