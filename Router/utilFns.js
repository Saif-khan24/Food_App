const jwt = require('jsonwebtoken');
const {JWT_SECRET} =process.env //||  require('../secrets');
const userModel = require('../model/userModel')


module.exports.protectRoute = function protectRoute(req, res, next){      //function me kcch dalo ya na dallo sb arguments array me aahi jata h
    //this func checks that only authenticated or login user come here
    try{
        console.log("reached protect route");
        //cookie-parser
        console.log("61", req.cookies);

        let decryptedToken = jwt.verify(req.cookies.JWT, JWT_SECRET);
        console.log('68', decryptedToken);
        // jwt -> verify everytime that if you are bringing the token to get your respods 
        
        if(decryptedToken){
            let userId = decryptedToken.id;
            req.userId = userId;
            next();
        }else{
            res.send('kindly login to access this resource')
        }
    }
    catch(err){
        res.status(200).json({
            message: err.message
        })
    }
}

module.exports.bodyChecker = function bodyChecker(req, res, next){      //function me kcch dalo ya na dallo sb arguments array me aahi jata h
    console.log("reached body checker");
    let isPresent = Object.keys(req.body);
    console.log('ispresent', isPresent);
    if(isPresent.length){
        next();
    }else{
        res.send('send details in body')
    }
}

module.exports.isAuthorized = function isAuthorized(roles){
    console.log("i will run when the server is started")
    return async function(req, res, next){
        console.log("i will run when a call is made")
        let { userId } = req;
        try{
            let user = await userModel.findById(userId)
            let userisAuthorized = roles.includes(user.role)
            if(userisAuthorized) {
                next();
            } else {
                res.status(401).json({
                    message: 'user not authorized'
                })
            }
        }
        catch(err){
            console.error(err);
            res.status(500).json({
                message: 'server error'
            })
        }
    }
}