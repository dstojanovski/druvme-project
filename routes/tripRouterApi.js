const express = require('express');
const ToursController = require('../controllers/tripsController');
const AuthController = require('../controllers/authController');

const router = express.Router();

// Use middleware function to check the ID for the routes that has ids. VERY USEFULL.
// router.param('id', tripController.checkId());

router.route('/')
.get(ToursController.getAllTours)
// .post(AuthController.protect, ToursController.addNewTour);
.post(AuthController.protect, ToursController.addNewTour);

router.route('/:id')
.get(ToursController.getTour)
.patch(AuthController.protect,AuthController.restrictTo('admin'), ToursController.updateTour)
.delete(AuthController.protect, AuthController.restrictTo('admin'), ToursController.deleteTour);

module.exports = router;