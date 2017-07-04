const mongoose = require('mongoose');
const Listing = mongoose.model('Listing');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next){
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto){
      next(null, true);
    }else{
      next({message: 'That filetype isn\'t allowed'}, false);
    }
  }
};

exports.homePage = (req, res) => {
  res.render('index');
};

exports.addListing = (req, res) => {
  res.render('editListing', {title: 'Add Listing'});
};

exports.upload = multer(multerOptions).single('pic');
exports.resize = async (req, res, next) => {
  if(!req.file){
    next();
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.pic = `${uuid.v4()}.${extension}`;
  const pic = await jimp.read(req.file.buffer);
  await pic.resize(800, jimp.AUTO);
  await pic.write(`./public/uploads/${req.body.pic}`);
  //once we have written the picture to our filesystem, keep moving
  next();
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
  const listing = await Listing.findOne({ _id: req.params.id });
  res.render('editListing', {title: `Edit ${listing.title}`, listing });
};

exports.updateListing = async (req, res) => {
  // set the location data to be a Point
  req.body.location.type = 'Point';
  // Find and update listing
  const listing = await Listing.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated <strong>${listing.title}</strong>. <a href="/listings/${listing.slug}">View Listing -></a>`)
  res.redirect(`/listings/${listing._id}/edit`);
};

exports.getListingBySlug = async (req, res ) => {
  const listing = await Listing.findOne({slug: req.params.slug});
  if(!listing) return next();
  res.render('listing', { listing, title: listing.title});
};
