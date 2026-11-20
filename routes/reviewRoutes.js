const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// access params from other routers use mergeParams
const router = express.Router({ mergeParams: true });

// all routes below require authentication
router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReviewById)
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  );

module.exports = router;
