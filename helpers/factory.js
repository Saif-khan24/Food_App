function createElement(elementModel){

    return async function (req, res){
        try{
            let element = await elementModel.find();
            res.status(200).json({
                element: element
            });
        }
        catch(err){
            console.log(err);
            res.status(502).json({
                message: "server error"
            })   
        }
    }
}

function deleteElement(elementModel){
    return async function (req,res){
        let {id} = req.params;
        try{
            let element = await elementModel.findByIdAndDelete(id);
            res.status(200).json({
                element: element
            })
        }
        catch(err){
            console.log(err);
            res.status(500).json({
                message: "server error"
            })   
        }   
    }    
}

function getElement(elementModel){
    return async function(req, res){
        let {id} = req.params;
        try{
            let elements = await elementModel.findById(id);
            res.status(200).json({
                    message: elements
            });
        }
        catch(err){
            res.status(502).json({
                message: err.message
            })   
        }
    }   
}

function getElements(elementModel){
    return async function(req, res){
        try{
            let requestPromise;
            // query
            if(req.query.myQuery){
                requestPromise = elementModel.find(req.query.myQuery);
            }
            else{
                requestPromise = elementModel.find();
            }

            // sort
            if(req.query.sort){
                requestPromise = requestPromise.sort(req.query.sort);
            }

            // select
            if(req.query.select){
                let params = req.query.select.split("%").join(" ");
                requestPromise = requestPromise.select(params);
            }

            // paginate
            let page = Number(req.query.page) || 1;
            let limit = Number(req.query.limit) || 3;
            let toSkip = (page - 1) * limit;
            requestPromise = requestPromise
                .skip(toSkip)
                .limit(limit);

            let elements = await requestPromise;
            res.status(200).json({
                    message: elements
            });
        }
        catch(err){
            res.status(502).json({
                message: err.message
            })   
        }
    }
}

function updateElement(elementModel){
    return async function(req,res){
        let {id} = req.params;
        try{
            if(req.body.password || req.body.confirmPassword){
                return res.json({
                    message: "use forget password instead"
                })
            }
            let element = await elementModel.findById(id);
            if(element){
                // delete req.body.id;            // or req.body.id = undefined;
                for(let key in req.body){
                    element[key] = req.body[key]
                }
                await element.save({
                    validateBeforeSave: false              //validators(like unique: true or required: true or anything like that) ko run hone se rokta h
                });
                res.status(200).json({
                    element: element
                })
            }else{
                res.status(404).json({
                    message: "user not found"
                });
            }
        }
        catch(err){
            console.log(err);
            res.status(500).json({
                message: "Server error"
            });
        }
    }
}

module.exports.createElement = createElement;
module.exports.deleteElement = deleteElement;
module.exports.getElement = getElement;
module.exports.getElements = getElements;
module.exports.updateElement = updateElement;