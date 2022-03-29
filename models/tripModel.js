const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    startingPoint: {
        type: String,
        required: ['true', 'Please choose your starting poing']
    },
    destination: {
        type: String,
        required: ['true', 'Please choose your destination of the trip']
    },
    price: {
    type: Number,
    required: ['true', 'Please add price of the trip']
    },
    startDate: {
        type: Date, 
    },
    startTime:{
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    passengers: {
        type: Number,
        required:['true', 'Please add the number of passengers']
    },
    luggage:{
        type: Number
    },
    carDescription: {
        type: String
    },
    tripDescription: {
        type: String
    },
    driver: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }
})

// '1' means that we index price in ASC and '-1' in DESC 
// tourSchema.index({price: 1})

// //PRESAVE HOOK, before saving something to the database.
// tripSchema.pre('save', async function(next){
//     this.startDate = 

//     //Encrypt the password.
//     this.password = await bcrypt.hash(this.password, 12);
//     // We dont like to have passwordConfirm in database, its required but its not required for the database.
//     this.passwordConfirm = undefined;
// })

//QUERY MIDDLEWARE
tripSchema.pre(/^find/, function(next) {
    this.populate({
        path:"driver",
        select: "-__v",
    });

    next();
});

const Trip = mongoose.model('Trip', tripSchema);

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

module.exports = Trip;