const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Tour must have a name'],
    trim: true,
    unique: true,
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    required: [true, 'A Tour requires a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A Tour must have a Maximum Group Size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A Tour must have a difficulty'],
  },
  price: {
    type: Number,
    required: [true, 'A Tour must have a price'],
  },
  discountPrice: {
    type: Number,
  },
  summary: {
    type: String,
    required: [true, 'A Tour must have a summary'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A Tour must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
