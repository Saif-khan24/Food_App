const mongoose = require('mongoose');
// auth pass: p5E3DiiCzUdJL
let { dbLink } = process.env //|| require('../secrets');
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

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },

    plan: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },

    bookedAt: {
        type: Date,
    },

    priceAtThatTime: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: [ "pending", "failed", "success"],
        required: true,
        default: "pending",
    },
})

const bookingModel = mongoose.model("PABbookingModel", bookingSchema)
module.exports = bookingModel;

// pehle build model the build router