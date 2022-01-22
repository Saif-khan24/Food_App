const mongoose = require('mongoose');
// auth pass: p5E3DiiCzUdJL
let { PASSWORD, dbLink } = process.env //|| require('../secrets');
const validator = require('email-validator');

mongoose
    .connect(dbLink)
    .then((connection)=>{
        console.log('database has been connected...')
    })
    .catch((err)=>{
        console.log("err", err.message);
    })

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "kindly pass the name"],
        unique: [true, "plan name should be unique"],
        // errors
        maxlength: [40, "Your plan length is more than 40 characters"],
    },

    duration : {
        type: Number,
        required: [true, "You need to provide duration"]
    },

    price: {
        type: Number,
        required: [true, "user should have a name"],
    },

    discount: {
        type: Number,
        validate: {
            validator: function(){
                return this.discount < this.price;
            },
            message: "Discount must be less than actual price",
        },
    },

    planImages: {
        type: [String],
    },

    reviews: {
        // array of object id
        type: [mongoose.Schema.ObjectId],
        ref: "PABReviewModel",
    },

    averageRating: Number,
    

})

//model
let planModel = mongoose.model('PABPlanModel', planSchema)
module.exports = planModel;