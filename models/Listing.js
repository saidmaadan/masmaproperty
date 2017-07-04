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
  tags: [String],
  pic: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [
      {
        type: Number,
        required: "You must supply coordinates"
      }
    ],
    address: {
      type: String,
      required: 'You must supply an address!'
    }
  }
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
