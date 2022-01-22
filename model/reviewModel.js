const mongoose = require('mongoose');
// auth pass: p5E3DiiCzUdJL
let { PASSWORD, dbLink } = process.env //|| require('../secrets');
// const validator = require('email-validator');

mongoose
    .connect(dbLink, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(function(db){
        console.log("connected to db...")
    })
    .catch(function (err){
        console.log("err ", err);
    })

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "Review can't be empty"]
    },

    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "Review must contain some rating"],
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    user: {
        type: mongoose.Schema.ObjectId,
        required: [true, "Review must belong to a user"],
        ref: "PABUserModel",   //optional (ye user ko apne aap utha leta h backend se)
    },

    plan: {
        type: mongoose.Schema.ObjectId,
        required: [true, "Review must belong to a user"],
        ref: "PABPlanModel",   //optional (ye user ko apne aap utha leta h backend se)
    },

});

const ReviewModel = mongoose.model("PABReviewModel", reviewSchema)
module.exports = ReviewModel;

// pehle build model the build router