const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');

// Do work here
router.get('/', listingController.homePage);

module.exports = router;
