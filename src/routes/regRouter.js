const express = require('express');
const regRouter = express.Router();
const session = require('express-session');
const profiles = require('../../src/models/profile.js');
const bcrypt = require('bcrypt');
const passport = require('passport');
const mongoose = require('mongoose');
const { ConnectionClosedEvent } = require('mongodb');

regRouter.use(passport.session());

function auth(req, res, next) {
    console.log(req.user) 
    // Checking for the authorization 
    if (!req.user) {
        console.log("in if")
        next();
    }
    else{
        console.log("in else: " + req.user)
        console.log("already logged in");
        res.redirect("/"); // need ethan's files
    }
};

regRouter.use(auth);

regRouter.get('/', async (req, res) =>{
    try{
        res.render("signup", {
            title: "Signup",
            userMail: "juandela.cruz@dlus.edu.ph"
        });
    }    
    catch(err){
        console.error(err);
        res.render("signup", {
            title: "Signup"
        });
    }
});

regRouter.post('/', async (req, res) =>{

    var results = await profiles.find( {email: req.body.email} );

    if (results.length == 0) {
        console.log("making user entry...");
        try {

            const hashPass = await bcrypt.hash(req.body.password, 10);
            const result = await profiles.create({
                username: req.body.username,
                desc: req.body.desc,
                pfp_link: req.body.pfp_link,
                user_type: req.body.user_type,
                email: req.body.email,
                password: hashPass,
                remember: req.body.remember,
                session: req.body.session
            });
            
            res.sendStatus(200);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }
    else{
        console.log("user already exists");
        res.sendStatus(422);
    }
});

module.exports = regRouter;