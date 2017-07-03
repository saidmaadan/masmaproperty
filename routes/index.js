const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');

const { catchErrors } = require('../handlers/errorHandlers');
// Do work here
router.get('/', catchErrors(listingController.getListings));
router.get('/listings', catchErrors(listingController.getListings));
router.get('/add', listingController.addListing);
router.post('/add', catchErrors(listingController.createListing));

module.exports = router;
