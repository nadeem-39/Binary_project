const express = require('express');
const router = express.Router();
const Events = require('../models/eventSchema.js');
const {validateEvent} = require('../middleware.js');





//new form render for event
router.get('/new',(req,res)=>{
    res.render('webPage/eventForm.ejs');
})

//creating new event
router.post('/create',validateEvent, async(req, res)=>{
    const newEvent = new Events(req.body.events);
    const eventData = await newEvent.save();
    req.flash('success','Event successfully added');
    res.redirect(`/event/${newEvent.type}`);
})

//similar event data
router.get('/show/:_id', async(req,res)=>{
    const {_id} = req.params;
    const currEvent = await Events.findById(_id);
    if(!currEvent){
        req.flash('error','Event no longer exist')
        res.redirect('/')
    }
    res.render('webPage/singleEventShow.ejs',{currEvent});
})

// delete event
router.delete('/delete/:id',async (req, res)=>{
    const {id} = req.params;
    let data  = await Events.findById(id);
    if(!data){
        req.flash('error','Event no longer exist')
        res.redirect('/')
    }
    await Events.findByIdAndDelete(id);
    
    req.flash('success','Event successfully deleted');
    res.redirect(`/event/${data.type}`);
    
    
})

//render edit form of event

router.get('/editForm/:id', async (req, res)=>{
    let {id} = req.params;
    
   
    let currEvent = await Events.findById(id);

    if(!currEvent){
        req.flash('error','Event no longer exist')
        res.redirect('/')
    }

    
    res.render('webPage/editEvent.ejs',{currEvent});
})


//update existing event
router.put('/edit/:id', validateEvent,                                                                                       async(req, res)=>{
    let {id} = req.params;
    let {events} = req.body;
    if(!events){
        req.flash('error','Event no longer exist')
        res.redirect('/')
    }
    await Events.findByIdAndUpdate(id,{...events});
    req.flash('success','Event successfully edited');
    res.redirect(`/event/show/${id}`);
})

router.get('/:type',async(req,res)=>{
    const type = req.params.type;
    let similarEvents = await Events.find({type:type});
    res.render('webPage/eventsShow.ejs',{similarEvents,type});
})


module.exports = router;
