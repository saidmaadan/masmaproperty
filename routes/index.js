const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const { catchErrors } = require('../handlers/errorHandlers');
// Do work here
router.get('/', catchErrors(listingController.getListings));
router.get('/listings', catchErrors(listingController.getListings));
router.get('/listings/page/:page', catchErrors(listingController.getListings));
router.get('/add', authController.isLoggedIn, listingController.addListing);

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

router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/register', userController.registerForm);
router.post('/register',
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get('/logout', authController.logout);

router.get('/profile', authController.isLoggedIn, userController.profile);
router.get('/editProfile', authController.isLoggedIn, userController.editProfile);
router.post('/editProfile', catchErrors(userController.updateProfile));

router.get('/forgot', userController.forgotPasswordForm);
router.post('/forgot', catchErrors(authController.forgot));
router.get('/reset/:token', catchErrors(authController.reset));
router.post('/reset/:token',
  authController.confirmedPassword,
  catchErrors(authController.updatePassword)
);

router.get('/map', listingController.listingsMapPage);
router.get('/favorites', authController.isLoggedIn, catchErrors(listingController.getfavorites));
router.post('/reviews/:id', authController.isLoggedIn, catchErrors(reviewController.addReview));
router.get('/top', catchErrors(listingController.getTopListings));
/*
  API
*/

router.get('/api/search', catchErrors(listingController.searchListings));
router.get('/api/listings/near', catchErrors(listingController.listingsMap));
router.post('/api/listings/:id/favorite', catchErrors(listingController.favoriteListing));

module.exports = router;
