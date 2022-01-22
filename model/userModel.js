const mongoose = require('mongoose');
// auth pass: p5E3DiiCzUdJL
let { PASSWORD, dbLink } = process.env //|| require('../secrets');
// or
// let PASSWORD;
//  if(process.env.PASSWORD){     // deployed
//    PASSWORD = process.env.PASSWORD
// } else {       // local
//      PASSWORD = require('../secrets').PASSWORD
// }

const validator = require('email-validator');
const bcrypt = require("bcrypt");

mongoose
    .connect(dbLink)
    .then((connection)=>{
        console.log('database has been connected...')
    })
    .catch((err)=>{
        console.log("err", err.message);
    })

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },

    email : {
        type: String,
        required: true,
        unique: true,
        validate: function(){
            //3rd party used for validation, if(truue) tabhi code aage jaaega
            return validator.validate(this.email)
        }
    },

    password : {
        type: String,
        required: true,
        min: 8,
    },

    confirmPassword: {
        type: String,
        required: true,
        min: 8,
        validate: function(){
            // own validation
            return this.password == this.confirmPassword 
        }
    },

    createdAt : {
        type: String,
    },

    token : {
        type: String,
        unique: true,
    },
    role : {
        type: String,
        enum: ['admin', 'ce', 'user'],
        default: 'user',
    },
    bookings: {
        type: [mongoose.Schema.ObjectId],
        ref: "PABbookingModel"
    }
})

// this is a hook, save hone se pehle 
userSchema.pre('save', function (next){
    // do stuff
    const salt = await bcrypt.genSalt(10);     //more the salt more it will take time to ecrypt
    this.password = await bcrypt.hash(this.password, salt);   //converts pass into anonymous text
    
    this.confirmPassword = undefined;
    // password ko encrypt bhi krlo
    next();
})

//document method
userSchema.methods.resetHandler = function (password, confirmPassword){
    const salt = await bcrypt.genSalt(10);     //more the salt more it will take time to ecrypt
    this.password = await bcrypt.hash(this.password, salt);   //converts pass into anonymous text
    
    this.confirmPassword = confirmPassword;
    this.token = undefined;
}

//model
let userModel = mongoose.model('PABUserModel', userSchema)
module.exports = userModel;