const Review = require('../models/reviewModel');
const catchAsync = require('.././utils/catchAsync');
const User = require('../models/userModel');
const factory = require('./handlerFactory');

exports.getReviewForm = async (req, res) => {
    try{
    const allReviews = await Review.find();
    res.status(200).json({
        results: allReviews.length,
        data: {
            tours: allReviews,
        }
    });
    }

    catch(err) {
        res.status(200).json({
            status: 'Bad request',
            message: err,
        });
    }
};

exports.getDriverReviews = catchAsync(async (req,res, next) => {
    if (!req.body.driverId){
        req.body.driver = req.params.driverId;
    }
    const reviews = await Review.find({reviewedDriver: req.body.driver});
    
    if (reviews.length === 0 ){
        res.status(404).json({
            status: "There is no review for this driver"
        })
    }

    res.status(200).json({
        status: 'Reviews',
        results: reviews.length,
        data: {
            reviews: reviews,
        }
    });


});

exports.addNewReview = catchAsync(async (req, res, next) => {

    if (!req.body.driver) {
        req.body.driver = req.params.driverId;
    }

    if(!req.body.user) {
        // Geting user from protect middleware
        req.body.user = req.user.id;
    }
    
    const newReview = await Review.create({
        createdAt: Date.now(),
        createdBy: req.user.id,
        reviewDescription: req.body.reviewDescription,
        rating: req.body.rating,
        reviewedDriver: req.body.driver
    });

    res.status('200').json({
        status: 'success',
        data : {
            // null : null
            trip : newReview,
        }
    });
});

exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);