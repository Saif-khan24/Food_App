const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser')
const userRouter = require('./Router/userRouter');
const authRouter = require('./Router/authRouter');
const planRouter = require('./Router/planRouter');
const reviewRouter = require('./Router/bookingRouter');
const app = express();

// const protectRoute = require('../foodApp/Route/authHelper');
// app.post('/', (req, res, next)=>{
//     let body = req.body;
//     console.log('before', body);
//     next()
// })

app.use(express.static('Frontend_folder'));  //reserve a folder only from which the client can access the file
app.use(express.json());       //for post, has inbuilt next func, 
app.use(cookieParser());       //for cookies and all

// read data storage
// let content = JSON.parse(fs.readFileSync('./data.json'));

app.use('/api/user', userRouter);
app.use('/api/plan', planRouter);
app.use('/api/auth', authRouter);
app.use('/api/review', reviewRouter);

app.listen(process.env.PORT || '5000', ()=>{
    console.log('server started');
})

app.use(function(req, res){
    // res.sendFile('./Frontend_folder/404.html', {root: __dirname});
    // res.status(404).sendFile(path.join(__dirname, './Frontend_folder','404.html'));
    res.status(404).json({
        message: "404 page not found"
    })
})

// steps
// 1. see you have all the passwords of razorpay, gmail, ...
// 2. get all the code of backend such that app1.js is outside of all
// 3. goto package.json and then in "start" script just do "node app1.js"
// 4. app1.js ke port ko replace krke process.env likhdo
// 5. at all require secret file replace it with process.env
// 6. except secret and node_module file push all code to github in a new repo

// 7. login to heroku and dashboard to create new app
// 8. heroku dashboard to setting to config vars(all secrets copy) to deploy(github repo) 
// 9. if error install heroku cli then see at cmd -> heroku -> heroku login -> heroku logs -a "foodapplication-backend" -t
// 10. Congratulations backend deployed

// cmd to run : node app1.js