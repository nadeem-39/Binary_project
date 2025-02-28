const express = require('express');
const router= express.Router();
const {validateMember} = require('../middleware.js');
const User = require('../models/userSchema.js');
const { route } = require('./memberRoute.js');
const passport = require('passport');


router.get('/signUpForm', (req,res)=>{
    res.render('webPage/signup.ejs');
})

router.post('/signup',async (req,res)=>{
    let{username, email,password} = req.body;
    console.log(username,email,password);
    const newUser= new User({email,username});
    
    await User.register(newUser,password);
    req.flash('success',`@${username} thankyou for registration`);
    res.redirect('/');
})

router.get('/signInForm', (req,res)=>{
    res.render('webPage/signin.ejs');
})


router.post('/signin', passport.authenticate('local',{failureRedirect:'/user/signInForm', failureFlash: true}), async(req,res)=>{
    req.flash('success','Welcome back to Binary club');
    res.redirect('/')
})


module.exports = router;