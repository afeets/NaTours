const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Tour must have a name'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
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
      select: false, // exclude from output
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('DurationInWeeks').get(function () {
  return this.duration / 7;
});

// document middleware, function called before doc save and create methods to DB
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
