const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must log in to write your review'
  },
  listing: {
    type: mongoose.Schema.ObjectId,
    ref: "Listing",
    required: 'You must supply a listing'
  },
  content: {
    type: String,
    required: "Your review must have text"
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  }

});

function autopopulate(next){
  this.populate('author');
  next();
}

reviewSchema.pre('find', autopopulate);
reviewSchema.pre('findOne', autopopulate);


module.exports = mongoose.model('Review', reviewSchema);
