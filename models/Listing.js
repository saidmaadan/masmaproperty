const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    require: "Please enter title for your listing"
  },
  description: {
    type: String,
    trim: true,
    require: "Please enter description for your listing"
  },
  slug: String,
  tags: [String]
});
listingSchema.pre('save', function(next){
  if (!this.isModified('title')){
    next();
    return;
  }
  this.slug = slug(this.title);
  next();
});

module.exports = mongoose.model('Listing', listingSchema);
