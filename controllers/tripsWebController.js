const TripModel = require('../models/tripModel');
const catchAsync = require('.././utils/catchAsync');
const AppError = require('../utils/appError');


exports.getToursWeb = async (req, res) => {
    try{
    const allTrips = await TripModel.find();
    res.status(200).render('trips', {
        trips: allTrips}
        );
    }

    catch(err) {
        res.status(200).json({
            status: 'Bad request',
            message: err,
        });
    }
};

exports.newTripForm = catchAsync(async (req, res, next ) => {
    res.status(200).render('newTripForm');
});