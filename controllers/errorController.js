const AppError = require('./../utils/appError');

const handleCastErrorDb = err => {
    const message = "Invalid $(err.path} : ${err.value}.";
    return new AppError(message, 400); 
}

const handleValidationErrorDb = () => {

    const message = "Invalid input Data";
    return new AppError(message, 400);
}

const handleTokenError = () => {
    const message = "You are not authorized, please login again";
    return new AppError(message, 404);
}

const handleTokenExpiredError = err => {
    const message = "Your session and token has expired, please login again";
    return new AppError(message, 404);
}

const sendErrorDev = (err, req, res) => {
// HANDLING API ERRORS
  if(req.originalUrl.startsWith("/api")){
    return res.status (err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
  }
  // HANDLING RENDER 
  return res.status(err.statusCode).render('error' , {
      title: 'Something went wrong',
      msg: err.message,
   });
  
}

const sendErrorProd = (err, req, res) => {
    // Operational error that we trust from the custom AppError class.
    // A) Handling API Errors
    if(req.originalUrl.startsWith("/api")){
        if (err.isOperational){
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            })
        }
    
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        })
        
    }

    // B) Handling Rendered Errors
    if(err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong',
            msg: err.message,
        });
    }
        
    return res.status(err.statusCode).render('error' , {
        title: 'Something went wrong',
        msg: 'Please Try again later.',
    });
}

module.exports = (err, req, res, next) => {
    console.log(err);

    // errorCode or 500 (Internal Server error)
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    }
    else if (process.env.NODE_ENV === 'production'){
        let error = {...err};
        error.message = err.message;

        console.log(err);
        if (error.name === 'CastEror') error = handleCastErrorDb(error);
        if (error.name == 'ValidationError') error = handleValidationErrorDb(error);
        if (error.name === 'JsonWebTokenError') error = handleTokenError();
        if (error.name === 'TokenExpiredError') error = handleTokenExpiredError();

        sendErrorProd(error, req, res);
    }

};