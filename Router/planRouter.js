// requirements
const express = require("express");
let planRouter = express.Router();
let planModel = require('../model/planModel');
const {protectRoute, bodyChecker, isAuthorized} = require('../Router/utilFns')

const { createElement,
    getElement, getElements,
    updateElement,
    deleteElement 
   } = require('../helpers/factory');

const createPlan = createElement(planModel);
const deletePlan = deleteElement(planModel);
const updatePlan = updateElement(planModel);
const getPlans = getElements(planModel);
const getPlan = getElement(planModel);

planRouter.use(protectRoute);

planRouter
    .route('/')
    .post(bodyChecker, isAuthorized(['admin']), createPlan)
    .get(protectRoute, isAuthorized(['admin', 'ce']), getPlans)          //localhost/user -> get

planRouter
   .route("/sortByRating", getbestPlans);

planRouter
    .route('/:id')
    .get(getPlan)
    .patch(bodyChecker,  isAuthorized(['admin', 'ce']), updatePlan)  //ce = customer executive
    .delete(bodyChecker, isAuthorized(['admin']), deletePlan)


async function getbestPlans(req, res){
    console.log("best plans ");
    try{
        let plans = await planModel.find()          //find empty rehta h to saari ratings aa jati hn
                    .sort("-averageRating")
                    .populate({
                        path: "reviews",
                        select: "review"
                    })

        console.log(plans);
        res.status(200).json({
            message: err.message
        })
    }
    catch(err){
        console.log(err);
        res.status(200).json({
            message: err.message
        })
    }
}

module.exports = planRouter;