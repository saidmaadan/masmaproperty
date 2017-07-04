const mongoose = require('mongoose');
const Listing = mongoose.model('Listing');

exports.homePage = (req, res) => {
  res.render('index');
};

exports.addListing = (req, res) => {
  res.render('editListing', {title: 'Add Listing'});
};

exports.createListing = async (req, res) => {
  // const listing = new Listing(req.body)
  // await listing.save();
  const listing = await (new Listing(req.body)).save(); //short cut
  req.flash('success', `Successfully Created ${listing.title}`);
  res.redirect(`/listing/${listing.slug}`);
};

exports.getListings  = async (req, res) => {
  const listings = await Listing.find()
  res.render('listings', {title: "Listings", listings });
};

exports.editListing  = async (req, res) => {
  // set the location data to be a Point
  req.body.location.type = 'Point';
  // Find listing by listing id
  req.body.location.type = 'Point';
  const listing = await Listing.findOne({ _id: req.params.id });
  res.render('editListing', {title: `Edit ${listing.title}`, listing });
};

exports.updateListing = async (req, res) => {
  // Find and update listing
  const listing = await Listing.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated <strong>${listing.title}</strong>. <a href="/listings/${listing.slug}">View Listing -></a>`)
  res.redirect(`/listings/${listing._id}/edit`);
}
