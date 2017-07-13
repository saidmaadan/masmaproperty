const mongoose = require('mongoose');
const Review = mongoose.model('Review');

exports.addReview = async (req, res) => {
  req.body.author = req.user._id;
  req.body.listing = req.params.id;
  const newReview = new Review(req.body);
  await newReview.save();
  req.flash('success', 'Review saved!');
  res.redirect('back');
  // res.json(req.body);

};
