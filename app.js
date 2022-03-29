const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require ('./controllers/errorController');
const userRouterApi = require('./routes/userRouterApi');
const tourRouterApi = require('./routes/tripRouterApi');
const tripRouterWeb = require('./routes/tripRouterWeb');
const reviewRouterApi = require('./routes/reviewRouterApi');
const googleAuth = require('./routes/googleRouter');
const cookieParser = require('cookie-parser');
// const AppError = require('./utils/appError');

const app = express();

// GLOBAL MIDDLEWARES

// Use helmet middleware to protect the http headers.
app.use(helmet());

// Midleware for limit the request for DOS ATTACKS
const limiter = rateLimit({
    max: 100,
    // Convert to miliseconds
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.set('view engine', 'pug');

// Serving stati files
app.set ('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

console.log(process.env.NODE_ENV);

// Body parser - reading data from the body into req.body + limited to 10KB
app.use(express.json({
    limit: '10kb',
}));

// Parse the data and we could use the data from form in the traditional way-> Without JS included. Directly from HTML.
app.use(express.urlencoded({ extended:true, limit: '10kb'}));

// Get the data from the cookie
app.use(cookieParser());

// Data sanitazition agains NoSQL query injection
app.use(mongoSanitize());

// Data sanitazation agains XSS. Hacked/Malicious Script
app.use(xss());

// Prevent parameter pollution + whitelist
// Whitelist allows us to have more arguments of that list for ex duration=6 and duration=9
app.use(hpp({
    whitelist: [
        'duration'
    ]
}));

// TEST THE MIDDLEWARE
// app.use((req,res,next) =>{
//     console.log(req.cookies.jwt);
//     next();
// })

// ROUTES
app.use('/api/v1/trips', tourRouterApi);
app.use('/trips', tripRouterWeb);
app.use('/', tripRouterWeb);
app.use('/google/auth', googleAuth);
app.use('/api/v1/users', userRouterApi);
app.use('/api/v1/reviews', reviewRouterApi);

app.all('*', (req, res, next) => {
// const err = new Error('Cant find ${req.originalURL} on this server!');
// err.status = 'fail';
// err.statusCode = 404;
// next(err);


// If we send err in the next function its will skip all middlewares and go to the global middleware with 4 arguments.
// next (err)

// We create a different AppError to handle all the errors and send to the global error middleware.
console.log(req);
next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));

});


//Creating error middleware and refactor this function to errorController.js 
app.use(globalErrorHandler);

module.exports = app;