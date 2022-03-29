const Trip = require('../models/tripModel');
const catchAsync = require('.././utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// class ApiFeatures{
//     constructor(query, query)
// }

// The error handling function only implement on GetAllTours and GetTour for example.
exports.getAllTours = catchAsync( async(req, res, next) => {

    // 1) Build a query

    // A new object that will contain all req.query, Its very important because if its not done in that way
    // everything that we change in a new queryObj also will change the req.query object.
    const queryObj = {...req.query};

    // Delete all words from the query so after that we will only filter the query.
    const exludedFields = ['page', 'sort', 'limit', 'fields'];
    exludedFields.forEach(el => delete queryObj[el]);


    // 1A) Filtering
    let query = Trip.find(queryObj);

    // 1B) Sorting
    query = query.sort('startTime');

    // 2) Execute a query
    const allTours = await query;


    // 3) Send response
    res.status(200).json({
        results: allTours.length,
        data: {
            tours: allTours,
        }
    });
    
});

exports.getTour = catchAsync( async(req, res, next) => {
    var tour = await Trip.findById(req.params.id);

    if (!tour){
        return next(new AppError('The tour is not found', 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            tour: tour,
        }
    });

})

//Refactor to handleController.
exports.updateTour = factory.updateOne(Trip)


exports.addNewTour = catchAsync (async (req, res) => {

    // CREATING A NEW MODEL DIRECTLY WITHOUT CREATING DOCUMENT. 
    const newTrip = await Trip.create({
        startingPoint: req.body.startingPoint,
        destination: req.body.destination,
        startDate: req.body.startDate,
        startTime: req.body.startTime,
        price: req.body.price,
        passengers: req.body.passengers,
        driver: req.user.id,
    });

    res.status('200').json({
        status: 'success',
        data : {
            trip : newTrip,
        }
    });
    
});

// exports.deleteTour = async (req, res) => {
// try {
//        await Trip.findByIdAndDelete(req.params.id);

//     res.status(200).json({
//         status: "The tour was deleted successfully",
//     });
// }
//     catch (err) {
//         res.status('400').json({
//             status: 'fail',
//             message : err,
//         });
//     }
// };

// Refactoring the code to handlerFactory
exports.deleteTour = factory.deleteOne(Trip);