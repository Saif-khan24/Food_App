// dependencies
const express = require('express')
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = process.env //|| require('../secrets');
const userModel = require('../model/userModel');
//router
const authRouter = express.Router();

const {bodyChecker} = require('../Router/utilFns') 
const emailSender = require('../helpers/emailSender')

//routes and its functions
authRouter.use(bodyChecker);       //to avoid writing same func at multiple places       
authRouter.route('/signup').post(signupUser)
authRouter.route('/login').post(loginUser)
authRouter.route('/forgetPassword').post(forgetPassword)
authRouter.route('/resetPassword').post(resetPassword)


async function loginUser(req, res){
    try{
        let {email, password} = req.body;
        let user = await userModel.findOne({ email })
        if(user){
            //password
            if(user.password == password){
                let token = jwt.sign({id: user['_id']});     // JWT_SECRET, {httpOnly: true});
                res.cookie('JWT', token)
                res.status(200).json({
                    data: user,
                    message: "user logged in"
                })
            }
            else{
                res.status(404).json({
                    message: "email or password is incorrect"
                })
            }
        }else{
            res.status(200).json({
                message: "user not found"
            });
        }
    } catch(err){
        console.log(err.message);
        res.status(500).json({
            message: err.message,
        })
    }
}

//forget and reset
async function forgetPassword(req, res){
    try{
        let {email} = req.body;
        // search on the basis of email
        let user = await userModel.findOne({email})
        if(user){
            // create token
            let token = (Math.floor(Math.random()*10000) + 10000).toString().substring(1);
            
            // -> update the user with a new token
            await userModel.updateOne({email}, {token})
            let newUser = await userModel.findOne({email})

             //email send after update of token
            await emailSender(token, user.email)    //expiryDate/validUpto wagaira can be added in email

            res.status(200).json({
                message: "user token send to your email",
                user : newUser,
                token
            })
        }
        else{
            console.log(err.message);
            res.status(404).json({
                message: "user not found",
            })
        }
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({
            message: err.message,
        })
    }
}

async function resetPassword(req, res){
    // user will come with token and
    // enter newPassword and password
    try{
        let {token, confirmPassword, password} = req.body;
        let user = await userModel.findOne({token})
        console.log("user 108 ", user);
        if(user){
            // await userModel.updateOne({token}, {
            //     token: undefined,
            //     password: password,
            //     confirmPassword : confirmPassword,
            // }, {runValidators: true})

            // in server
            // user.password = password;
            // user.confirmPassword = confirmPassword;
            // user.token = undefined;
            user.resetHandler(password, confirmPassword)
            await user.save();     //database entry

            let newUser = await userModel.findOne({email: user.email});
            res.status(200).json({
                message: "user token send to your email",
                user: newUser,
            })
        }else{
            res.status(404).json({
                message: "user with this token not found",
            })
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    }
}

    // function temploginUser(req, res){
    //     let {email, password} = req.body;
    //     let obj = content.find((obj)=>{
    //         return obj.email == email
    //     })
        
    //     if(!obj){
    //         return res.status(404).json({
    //             message: "user not found"
    //         })
    //     }
    
    //     if(obj.password == password){
    //         var token =  jwt.sign({ email : obj.email}, JWT_SECRET);   //first time cookie
    //         res.cookie('JWT', token);   //header set kra h
    //         console.log(token);
    
    //         // res ki body bheji 
    //         res.status(200).json({
    //             message: "user logged in",
    //             user: obj
    //         })
    //     }
    //     else{
    //         res.status(422).json({
    //             message: "email or password doesn't match"
    //         })
    //     }
    // }
    
    async function signupUser(req, res){
        try{
            let newUser = await userModel.create(req.body)
            res.status(200).json({
                message: "user created successfully",
                user: newUser,
            })
        }
    
        catch(err){
            console.log(err.message);
            res.status(500).json({
                message: err.message,
            })
        }
        // let {name, email, password, confirmPassword} = req.body;
        // if(password == confirmPassword){
        //     let newUser = {name, email, password}
        //     //entry put
        //     content.push(newUser)
        //     //save in the datastorage
        //     fs.writeFileSync('data.json', JSON.stringify(content))
        //     res.status(201).json({
        //         createdUser: newUser
        //     })
        // } else{
        //     res.status(422).json({
        //         message: "password and confirm password do not match"
        //     })
        // }
    }


module.exports = authRouter;