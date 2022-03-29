const Trip = require('../models/tripModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
// const Booking = require('../models/bookingModel');
const catchAsync = require('.././utils/catchAsync');
const AppError = require('../utils/appError');

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
      title: 'Log into your account'
    });
  };

  exports.getTourWeb = catchAsync(async (req, res, next) => {
    var trip = await Trip.findById(req.params.id);

    if (!trip) {
      return next(new AppError('There is no tour with that name.', 404));
    }

    res.status(200).render('trip', {
      title: `Trip to ${trip.destination}`,
      trip: trip,
    });
  })

  exports.getMyProfile = catchAsync (async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).render('account', {
      title: user.name,
      user: user,
    });
  })

  exports.getUserWeb = catchAsync(async(req, res, next) => {
    const user = await User.findById(req.params.id);

    const reviews = await Review.find({reviewedDriver: req.params.id}).select('rating createdBy reviewDescription').limit(5);
    ;

    if(!user){
        return next(new AppError('This user was not found or have been deleted.', 404));
    }

    res.status('200').render('userPage', {
      title: user.name,
      listeduser: user,
      reviews: reviews,
      results: reviews.length, 
    });

})