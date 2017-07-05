const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const { catchErrors } = require('../handlers/errorHandlers');
// Do work here
router.get('/', catchErrors(listingController.getListings));
router.get('/listings', catchErrors(listingController.getListings));
router.get('/add', listingController.addListing);

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
router.get('/tags', catchErrors(listingController.getListingsByTag));
router.get('/tags/:tag', catchErrors(listingController.getListingsByTag));

module.exports = router;
