const UserModel = require('../models/userModel');
const Review = require('./../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// Filter the fields that we only want to update
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    //Loop through obj in JavaScript
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)){
            newObj[el] = obj[el];
        }
    })

    return newObj;
}

exports.getAllUsers = async (req, res) => {
    try{
    const allUsers = await UserModel.find();
    res.status(200).json({
        results: allUsers.length,
        data: {
            tours: allUsers,
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

exports.addNewUser = async (req, res) => {
    try {
    // CREATING A NEW MODEL DIRECTLY WITHOUT CREATING DOCUMENT. 
    const newUser = await UserModel.create(req.body);
    res.status('200').json({
        status: 'success',
        data : {
            user : newUser,
        }
    });
    } catch (err) {
        res.status('400').json({
            status: 'fail',
            message : err,
        });
    }
};

exports.getUser = catchAsync(async(req, res, next) => {
    const user = await UserModel.findById(req.params.id);

    const reviews = await Review.find({reviewedDriver: req.params.id}).select('rating createdBy reviewDescription').limit(5);
    ;

    if(!user){
        return next(new AppError('This user was not found or have been deleted.', 404));
    }

    res.status('200').json({
        status: 'success',
        data : {
            driver : user,
            reviews: {
                results: reviews.length,
                reviewsData: reviews
            }
        }
    });

})

exports.getMe = catchAsync (async (req, res, next) => {
    req.params.id = req.user.id;
    next();
})

exports.updateMe = catchAsync(async(req, res, next) => {
    // 1) Create error if user POSTs password data
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError('This route is not for password updates. Please go to this to update your password', 404));
    }

    // 2) Update user document

    // Filter the fields that we only want to update
    const filteredBody = filterObj(req.body, 'name', 'email');

    // We cound use FindById and update because we do not update password here.
    const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
});

// Only make the user inactive
exports.deleteMe = catchAsync( async (req, res) => {
    await UserModel.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status: 'success',
        data: null,
    })        
});

// Do NOT update password with this and only admin can update it- DIFFERENT FROM /updateMe
exports.updateUser = factory.updateOne(UserModel);
exports.deleteUser = factory.deleteOne(UserModel);