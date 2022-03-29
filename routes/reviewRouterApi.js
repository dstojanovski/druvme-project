const express = require('express');
const ReviewsController = require('../controllers/reviewsController');
const authController = require('./../controllers/authController');

const router = express.Router();


// If we want to expand the router from another router and get parameters from there.
// const router = express.Router({mergeParams: true});

// Use middleware function to check the ID for the routes that has ids. VERY USEFULL.
// router.param('id', tripController.checkId());

// router.route('driver/:driverId/:reviewId').get(ReviewsController.getReview);

router.use(authController.protect);

router.route('/:driverId/add').get(authController.protect, ReviewsController.getReviewForm);
router.route('/:driverId').get(authController.protect, ReviewsController.getDriverReviews).post(authController.protect, ReviewsController.addNewReview);
// router.route('/:id').get(ReviewsController.getReviewsbyDriver).patch(ReviewsController.updateReview).delete(ReviewsController.deleteReview);
router.route('/:id').patch(ReviewsController.updateReview).delete(authController.restrictTo('admin'),ReviewsController.deleteReview);

module.exports = router;