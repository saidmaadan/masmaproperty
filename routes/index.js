const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const { catchErrors } = require('../handlers/errorHandlers');
// Do work here
router.get('/', catchErrors(listingController.getListings));
router.get('/listings', catchErrors(listingController.getListings));
router.post('/add',
  listingController.upload,
  catchErrors(listingController.resize),
  catchErrors(listingController.createListing));
router.post('/add/:id',
  listingController.upload,
  catchErrors(listingController.resize),
  catchErrors(listingController.updateListing));
router.get('/listings/:id/edit', catchErrors(listingController.editListing));
router.get('/listing/:slug', catchErrors(listingController.getListingBySlug));

module.exports = router;
