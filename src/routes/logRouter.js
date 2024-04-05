const express = require('express');
const logRouter = express.Router();
const cookieParser = require('cookie-parser');
var location = require('location-href')
//const profiles = require('../../src/models/profile.js');
//const mongoose = require('mongoose');
//const initializePassport = require('./passport-config.js');
const passport = require('passport');
//const flash = require('express-flash');

//logRouter.use(flash());
logRouter.use(express.json());
//logRouter.use(passport.initialize());
logRouter.use(passport.session());
logRouter.use(cookieParser());

logRouter.use((req,res,next) =>{
    req.time = new Date(Date.now()).toString();
    console.log(req.method,req.hostname, req.path, req.time);
    next();
});

logRouter.use(function(err, req, res, next) {
    console.log(err);
});

//initializePassport(
//    passport, 
//    async email => await profiles.find( {email: email} ),
//    async id => await profiles.find( {id: id} )
//);

function auth(req, res, next) { 
    console.log(req.user) 
    // Checking for the authorization 
    if (!req.user) { 
        next();
    }
    else{
        console.log("already logged in");
        res.redirect("/"); // need ethan's files
    }
};

logRouter.use(auth);

logRouter.get('/', async (req, res) =>{
    try{
        if(req.cookies.remember != "")
            res.render("login", {
                title: "Login",
                remembered: req.cookies.remember,
                isChecked: true
            });
        else
            res.render("login", {
                title: "Login"
            });
    }    
    catch(err){
        console.error(err);
        res.render("login", {
            title: "Login",

        });
    }
});

logRouter.post('/', passport.authenticate('local', { //test remember me
    failureRedirect: '/login',
    failureFlash: true
}), function(req, res) {
    if (req.body.remember) {
        res.cookie("remember" , req.body.email, {expire :3 * 7 * 24 * 60 * 60 * 1000});//req.session.cookie.maxAge = 3 * 7 * 24 * 60 * 60 * 1000;
        console.log(req.cookies.remember);
    } else {
        res.cookie("remember" ,"");
    }
    res.redirect("/") //add ur link here DO NOT add a slash at the start
});

module.exports = logRouter;