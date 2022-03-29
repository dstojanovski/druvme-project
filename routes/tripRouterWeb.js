const express = require('express');
const TripModel = require('../models/tripModel');
const tripWebController = require ('../controllers/tripsWebController');
const ViewsController = require('../controllers/viewsController');
const AuthController = require ('../controllers/authController');
// const router = require('./tourRouterApi');

const router = express.Router();

router.use(AuthController.isLogedIn);
router.route('/').get(AuthController.isLogedIn,tripWebController.getToursWeb);
router.route('/').post(AuthController.isLogedIn,tripWebController.getToursWeb);
router.route('/add-new-trip').get(AuthController.protect, tripWebController.newTripForm);
router.route('/login').get(AuthController.isLogedIn, ViewsController.getLoginForm);
router.route('/trip/:id').get(AuthController.isLogedIn, ViewsController.getTourWeb);
router.route('/user/:id').get(AuthController.isLogedIn, ViewsController.getUserWeb);
router.route('/me').get(AuthController.protect, ViewsController.getMyProfile);

module.exports = router;