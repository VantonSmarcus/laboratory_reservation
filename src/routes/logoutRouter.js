const express = require('express');
const logoutRouter = express.Router();
const passport = require('passport');
const profiles = require('../../src/models/profile.js');
const mongoose = require('mongoose');

//logoutRouter.use(passport.initialize());
logoutRouter.use(passport.session());
logoutRouter.use(express.json());

function auth(req, res, next) { 
    // Checking for the session 
    console.log(req.session) 
  
    // Checking for the authorization 
    if (!req.user) { 
        console.log("no user to logout");
        res.redirect("/login"); 
    }
    else{
        next();
    }
};

logoutRouter.use(auth);

logoutRouter.get('/', async (req, res) =>{
    
    try{
        res.render("logout", {
            title: "Logout"
        });
    }    
    catch(err){
        console.error(err);
        res.render("logout", {
            title: "Logout"
        });
    }
});

logoutRouter.post('/', async (req, res, next) =>{ //test logout

    res.clearCookie('connect.sid');
    res.cookie("remember" ,"");
    req.logout(function(err) {
		req.session.destroy(function (err) { // destroys the session
			res.send();
		});
    });
});

module.exports = logoutRouter;