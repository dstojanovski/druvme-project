const mongoose = require('mongoose');
const User = require('./userModel');

const reviewSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    reviewDescription: {
        type: String
    },
    rating: {
        type: Number,
        min: 1,
        max: 5 
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    reviewedDriver: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: [true,"Review must have a driver"],
    },
    
},
// Virtuals properties that are now stored into the database, like aggregation and calculation.
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

// Preventing dupicate reviews
reviewSchema.index({ reviewedDriver: 1, createdBy: 1}, { unique: true});

//QUERY MIDDLEWARE

reviewSchema.pre(/^find/, function(next){
this.populate({
    path: 'createdBy',
    select: 'name photo' 
    
})
next();
})

reviewSchema.statics.calcAverageRatings = async function (userId) {
    const stats = await this.aggregate([
        {
            // Select the User that we want to update.
            $match: {reviewedDriver: userId}
        },
        {
            $group: {
                _id: '$reviewedDriver',
                nRating: { $sum: 1},
                avgRating: {$avg: '$rating'}
            }
        }
    ]);

    if (stats.length > 0){
        await User.findByIdAndUpdate(userId,{
            nRatings: stats[0].nRating,
            ratingsAverage: stats[0].avgRating,
        });
    }
    else {
        await User.findByIdAndUpdate(userId,{
            nRatings: 0,
            ratingsAverage: 0,
        });
    }

}


// DOCUMENT MIDDLEWARE
// Calling this function after the Review is created -> Calculate the Average rating of the Driver/User.
reviewSchema.post('save', function() {
    // this points to current review.
    this.constructor.calcAverageRatings(this.reviewedDriver)
});


//QUERY MIDDLEWARE
// This we are using to calculate average when the review is updated or deleted and because it does not work with SAVE we have to implement in other way.
// We get the query and execute before it is actually executed and then call calcAverageRatings function on that.
// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.findOne().clone();
    next();
  });
  
  reviewSchema.post(/^findOneAnd/, async function() {
    // await this.findOne(); does NOT work here, query has already executed
    await this.r.constructor.calcAverageRatings(this.r.reviewedDriver);
  });

const Review = mongoose.model('Review', reviewSchema);

// CREATING A NEW DOCUMENT.
// const tripDocument = new Trip({
//     starting_point: 'Ljubljana',
//     destination: 'Bitola',
//     price: 50,
//     passengers: 2,
//     description: 'Test trip to Bitola',
// }) 

// tripDocument.save()
// .then(doc => { console.log(doc) })
// .catch(err => { console.log(err) });

module.exports = Review;