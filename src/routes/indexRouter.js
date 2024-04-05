var foundcurr

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const initializePassport = require('./passport-config.js');
const profiles = require('../../src/models/profile.js');
const reglogTest = express.Router();
const logRouter = require('./logRouter');
const regRouter = require('./regRouter');
const searchRouter = require('./searchRouter.js');
const appointRouter = require('./appointRouter.js');
const profileRouter = require('./profileRouter.js');
const logoutRouter = require('./logoutRouter.js')

reglogTest.use(session({
    secret: 'lmao guess',
    resave: false,
    saveUninitialized: false,
}));

logRouter.use(flash());
logRouter.use(express.json());
logRouter.use(passport.initialize());
logRouter.use(passport.session());


initializePassport(
    passport, 
    async email => await profiles.find( {email: email} ),
    async id => await profiles.find( {id: id} )
);

reglogTest.use((req,res,next) =>{
    req.time = new Date(Date.now()).toString();
    console.log(req.method,req.hostname, req.path, req.time);
    next();
});

reglogTest.use(function(err, req, res, next) {
    console.log(err);
});

reglogTest.get('/', (req, res) => {
    console.log("home");
    res.render("homePage");
    console.log(foundcurr)
});

reglogTest.post('/getuser', async function(req,res){
    try{
        console.log("Username is ", req.body.username)
        foundcurr = req.body.username
        console.log("Success: Found curr user!")
        console.log(foundcurr)
    }catch(err){
        console.log("Error: Failed to locate curr user", err)
    }

})

reglogTest.get('/labpage', async function(req,res) {
    try{
        const foundroom = req.query.room
        const founddate = req.query.date
        var founduser = foundcurr

        console.log(foundcurr)

        if(!founduser){
            founduser = '----'  
        }

        res.render('labpage', {
            roomNumber: foundroom,
            dateString: founddate,
            userName: founduser
        })
        console.log("Success: Redirection is complete")
    }catch(err){
        console.log("Error: Unable to redirect to the website")
    }
})

reglogTest.get('/currUser', async function(req,res) {
    try{
        res.send(foundcurr)
    }catch(err){
        console.log("Error: could not find current user")
    }
})


// Rendering profileSearch.html
reglogTest.get('/profileSearch', (req, res) => {
    console.log("rendering profile Search");
    res.render('profileSearch');
});


reglogTest.use('/login', logRouter);
reglogTest.use('/signup', regRouter);
reglogTest.use('/labsearch', searchRouter);
reglogTest.use('/labpage', appointRouter);
reglogTest.use('/profile', profileRouter);
reglogTest.use('/logout', logoutRouter)
module.exports = reglogTest;