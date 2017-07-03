const mongoose = require('mongoose');
const listing = mongoose.model('Listing');

exports.homePage = (req, res) => {
  res.render('index');
};

exports.addListing = (req, res) => {
  res.render('editListing', {title: 'Add Listing'});
};

exports.createListing = async (req, res) => {
  // const listing = await new Listing(req.body).save(); //short cut
  const listing = new Listing(req.body)
  await listing.save();
  req.flash('success', `Successfully Created ${listing.title}`);
  res.redirect('/listing/${listing.slug}');
};

exports.getListings  = async (req, res) => {
  const listings = await listing.find()
  res.render('listings', {title: "Listings", listings });
}
