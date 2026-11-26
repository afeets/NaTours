const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // get tour data from collection
  const tours = await Tour.find();

  // build template

  // render template with tour data
  res.status(200).render('overview', {
    title: 'All Tours',
    tours: tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // get tour data, including guides and reviews
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  // build template

  // render template with all data

  res.status(200).render('tour', {
    title: 'The Forest Hiker',
    tour: tour,
  });
});
