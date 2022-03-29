const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// For random reset Token for reseting the password.
const crypto = require('crypto');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
    },
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    surename: {
        type: String,
    },
    email: {
        type: String, 
        required: [true, "Please enter your email"],
        unique: true,
        lowercase: true, 
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    photo: { 
        type: String,
        default: 'default-photo.jpeg'
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please enter your password confirm"],
        validate:{
            // Return true or false. Check if the this passwordConfirm === Password 
            // THIS ONLY WORK ON CREATE AND SAVE.
            validator: function(el){
                return el === this.password;
            }
        }
    },
    dateBirth: {
        type: Date, 
    },
    passwordChangedAt: {
        type: Date
    },

    role: {
        type: String,
        enum: ['user', 'driver', 'admin'],
        default: 'user'
    },
    passwordResetToken: String,
    passwordResetExpires: Date,

    active: {
      type: Boolean,
      default: true,
      select: false
    },

    ratingsAverage: {
        type: Number,
        min: 1,
        max: 5,
        // Return round val from 4.666666 to 4.7
        set: val => Math.round(val * 10) / 10,
    },

    nRatings: {
        type: Number,
    },
})

//PRESAVE HOOK, before saving something to the database.
userSchema.pre('save', function(next){
    if (!this.isModified('password' || this.isNew)){
        return next();
    }

    // Put the passwordChanged 1 second in the past because in Real scenario maybe the password will be changed after the user trying login and that will create error.
    this.passwordChangedAt = Date.now() - 1000;
    next();
})

userSchema.pre('save', async function(next){
    //Only run this if the password is modified
    if (!this.isModified('password')){
        return next();
    }

    //Encrypt the password.
    this.password = await bcrypt.hash(this.password, 12);
    // We dont like to have passwordConfirm in database, its required but its not required for the database.
    this.passwordConfirm = undefined;
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt){
        // Create timestamp of a date and diveded by 1000 because of miliseconds.
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function() {
    // Random reset Token. This password is send to the user and then user can use it to change his password.
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Crypting token to the database.
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

   // Add expiring time to the token in minutes.
   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

   return resetToken;
}

// Not list the inactive users on query.
userSchema.pre(/^find/, function(next) {
    this.find({active: {$ne: false}});
    next();
})

const User = mongoose.model('User', userSchema);

// CREATING A NEW DOCUMENT but now usefull.
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

module.exports = User;