const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  // Allow Nested Routes - if tour id not in body get value from url param
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = catchAsync(async (req, res, next) => {
  // get reviews matching tour id
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews: reviews,
    },
  });
});

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
