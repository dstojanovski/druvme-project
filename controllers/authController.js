// use utils that come out of the box and the use ES6 destuctoring and use only promisify to use a Promise.
const { promisify } = require('util');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const TripModel = require('./../models/tripModel');
const Review = require('./../models/reviewModel');
const catchAsync = require('.././utils/catchAsync');
const sendEmail = require('.././utils/email');
const crypto = require ('crypto');


const signToken = id => {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    return token;
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken (user.id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
      // Make cookie hardcoded into http protokol. Browser could not change it. Secure issue.
        httpOnly: true,

    }

    // If we are in production, set the secure to true.
    if (process.env.NODE_ENV === 'production'){
        cookieOptions.secure = true;
    }

    // Send cookie to the browser
    res.cookie('jwt', token, cookieOptions);

    // Remove password from the output.
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token: token,
        data: {
            user
        }
    });
}

exports.signup = async (req, res , next) => {
    try{
     const newUser = await User.create({
         // This allow only this fields to be entered into the database on creating a new User.
         name: req.body.name,
         email: req.body.email,
         role: req.body.role,
         password: req.body.password,
         passwordConfirm: req.body.passwordConfirm,
         passwordChangedAt: req.body.passwordChangedAt
     });

     // CREATING A TOKEN FOR USER.
    //  const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET, {
    //      expiresIn: process.env.JWT_EXPIRES_IN
    //  });

    createSendToken(newUser, 201, res);

    }catch (err) {
        res.status('400').json({
            status: 'fail',
            message : err.message,
        });
    }
};

exports.login = async(req, res, next) => {
    try{
        const { email, password } = req.body;

        //1) Check if email and password are provided
        if (!email || !password ) {
            return next(new AppError('Invalid email or password', 400));
        }

        //2) Check if user exist and the password is correct

        // If the field is select:false into the model we use + for selecting here in the query.
        const user = await User.findOne({email}).select('+password');

        // Check if the password is correct from the model method.
        // const correct = await user.correctPassword(password, user.password);


        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(new AppError('Invalid email or password', 400));
        }

        //3) If everything is ok, create and send a token to client
        // const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, {
        //     expiresIn: process.env.JWT_EXPIRES_IN
        // });

        createSendToken(user, 200, res);
    }
    catch (err) {
    res.status('400').json({
        status: 'fail',
        message : err,
    });
}

};


// For logging out, we create a empty cookie without a token. 
exports.logout = async (req, res) => {
    // Same way of creating a cookie with empty token.
    res.cookie('jwt','loogedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    } )
    res.status(200).json({status: 'success'});
}

exports.protect = async(req, res, next) => {
    try{

        let token;
    // 1) Getting token and check if the req have token.
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // We get the token from the cookie -> From browser.
        else if(req.cookies.jwt){
            token = req.cookies.jwt;
        }

        if (!token) {
            return next(new AppError('You are not logined in, Please login first to get access', 401));
        }
    // 2) Verification of the token

        // This all will give us a promise 
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
            
    // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser){
            return next(new AppError('The user no longer exist.', 404));
        }

    // 4) Check if user changed password after the token was issued

    if (currentUser.changedPasswordAfter(decoded.iat)){
        return next (new AppError('User recently changed password! Please log in again.', 401));
    }


    // Grant Access to the prodected routes.
    req.user = currentUser;
    next();
    }
    catch (err) {
        res.status('400').json({
            status: 'fail',
            message : err,
        });
    }
};

// Only for rendered pages and there is no ERORR.
exports.isLogedIn = async(req, res, next) => {
    // 1) Getting token and check if the req have token.
    try {
    if (req.cookies.jwt){
         // 1) verify the token and decode.
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        
            
        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser){
            return next(new AppError('The user no longer exist.', 404));
        }

        // 4) Check if user changed password after the token was issued

        if (currentUser.changedPasswordAfter(decoded.iat)){
            return next ();
        }


        // There is a LOGGED-IN USER.
        // WE put that user to the responds into the templates. And we pass this current user.
        res.locals.user = currentUser;
        return next();
    }
}catch (err){
    // If there is no cookie.
    return next();
}
next();
    
};

// Only admin and creator of the trips and reviews could delete the doc.
exports.restrictTo = (...roles) => {

    return async(req, res, next) => {
        if (req.baseUrl.split('/')[3] == 'trips'){
            var trip = await TripModel.findById(req.params.id).select('driver');
            var creator = trip.driver;
        }
        else if (req.baseUrl.split('/')[3] == 'reviews'){
            var review = await Review.findById(req.params.id).select('createdBy');
            var creator = review.createdBy;
            }

        if (creator && creator.id === req.user.id){
            return next ();
        }
        // Roles is an array, we wrap the middleware in this function because we can not send parameters to middleware.
        if (!roles.includes(req.user.role)) {
            return next (new AppError('You do not have permission to perform this action', 403));
        }

        next();
    };
};

exports.forgotPassword = catchAsync(async(req, res , next) => {
// 1) Get user based on Posted email.
const user = await User.findOne({email: req.body.email});

if(!user){
    return next (new AppError('The user with that mail does not exist.', 404));
}

// 2) Generate random token, crypt it and save encrypted into the database.

const resetToken = user.createPasswordResetToken();

// ValidateBeforeSave skip all validation on saving like Empty password, empty configPasswords
await user.save({ validateBeforeSave: false });

// 3) Send the token to the mail decrypted.
const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;

const message = `Forgot your password? Submit a PATCH request with your new password and PasswordConfirm to: ${resetURL}./n If you did not fogot your password, please ignore this message`;

try{

    await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10min)',
        message: message
    });
    
    res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
    });
}
catch(err){
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next (new AppError(err, 500));
}

});


exports.resetPassword = catchAsync( async(req, res, next) => {
    // 1) Get user based on the token

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // Find the user by the token and compare if the passwordReset is expired
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    // 2) if token has not expired, and there is user, set the new password.

    if (!user){
        return next(new AppError('There is no user or the PasswortToken is expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // 3) update changedPassswordAt property for the user

    // 4) Login the user, sent JWT token to the client.

    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync( async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');;
    
   

    // 2) Check if the posted password is correct

     if (!user || !(await user.correctPassword(req.body.oldPassword, user.password))) {
        return next (new AppError('Please provide the old password', 401));
    }

    // 3) if so, update password
    
    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.newPasswordConfirm;
    
    await user.save();

    // 4) Log user in, send JWT.

    createSendToken(user, 200, res);
});