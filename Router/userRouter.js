// express put
const express = require('express');
// router
const userRouter = express.Router();
// user model
const userModel = require('../model/userModel')
const {protectRoute, bodyChecker, isAuthorized} = require('../Router/utilFns')
const { createElement,
     getElement, getElements,
     updateElement,
     deleteElement 
    } = require('../helpers/factory')

    
const createUser = createElement(userModel);
const deleteUser = deleteElement(userModel);
const updateUser = updateElement(userModel);
const getUsers = getElements(userModel);
const getUser = getElement(userModel);


//routes
userRouter.use(protectRoute);
// userRouter
    // .route('/:id')
    // .get(getUser)

userRouter
    .route('/')
    .post(bodyChecker, isAuthorized(['admin']), createUser)
    .get(protectRoute, isAuthorized(['admin', 'ce']), getUsers)          //localhost/user -> get

userRouter
    .route('/:id')
    .get(getUser)    //    isAuthorized(['admin', 'ce'])
    .patch(bodyChecker, updateUser)  //ce = customer executive
    .delete(bodyChecker, isAuthorized(['admin']), deleteUser)

// moderators or users
// async function getUser(req, res){
//     let {id} = req.params;
//     try{
//         let users = await userModel.findById(id);
//         res.status(200).json({
//                 message: users
//         });
//     }
//     catch(err){
//         res.status(502).json({
//             message: err.message
//         })   
//     }
// }

// async function getUsers(req, res){
//     try{
//         let users = await userModel.find();
//         res.status(200).json({
//                 message: users
//         });
//     }
//     catch(err){
//         res.status(502).json({
//             message: err.message
//         })   
//     }
// }

// async function updateUser(req,res){
//     let {id} = req.params;
//     try{
//         if(req.body.password || req.body.confirmPassword){
//             return res.json({
//                 message: "use forget password instead"
//             })
//         }
//         let user = await userModel.findById(id);
//         if(user){
//             // delete req.body.id;            // or req.body.id = undefined;
//             for(let key in req.body){
//                 user[key] = req.body[key]
//             }
//             await user.save({
//                 validateBeforeSave: false              //validators(like unique: true or required: true or anything like that) ko run hone se rokta h
//             });
//             res.status(200).json({
//                 user: user
//             })
//         }else{
//             res.status(404).json({
//                 message: "user not found"
//             });
//         }
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json({
//             message: "Server error"
//         });
//     }
// }

// only authorized to admin
// async function createUser(req,res){
//     try{
//         let user = await userModel.create(req.body);
//         res.status(200).json({
//             user: user
//         })
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json({
//             message: "Server error"
//         })   
//     }
// }

// async function deleteUser(req,res){
//     let {id} = req.params;
//     try{
//         let user = await userModel.findByIdAndDelete(id);
//         res.status(200).json({
//             user: user
//         })
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json({
//             message: "server error"
//         })   
//     }
// }



module.exports = userRouter;

// 5 october: hw : plan ka model bnao(name-unique and req, string, duartion-number, price-number, discount-number, less than price),
// crud likho plans ka, 
// delete and create only admin, readl all , update admin and ce, 
//  all on /api/plans
// https://github.com/Jasbir96?tab=repositories