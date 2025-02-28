const express = require('express');
const router= express.Router();
const {validateMember} = require('../middleware.js');
const Members = require('../models/memberSchma.js')

// new member form 
router.get('/new',(req,res)=>{
    res.render('webPage/memberForm.ejs');
})

// new member creater
router.post('/create',validateMember, async(req,res)=>{
    const newMember = new Members(req.body.members);
    const memberData = await newMember.save();
    req.flash('success','Successfully added new member')
    res.redirect('/');
})

// member deletion
router.delete('/delete/:id', async(req, res)=>{
    const {id} = req.params;
    const data = await Members.findByIdAndDelete(id);
    req.flash('success','Successfully deleted new member');
    res.redirect('/');
})


module.exports = router;
