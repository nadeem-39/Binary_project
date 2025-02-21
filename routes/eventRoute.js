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
    res.redirect(`/event/${newEvent.type}`);
})

//similar event data
router.get('/show/:_id', async(req,res)=>{
    const {_id} = req.params;
    const currEvent = await Events.findById(_id);
    res.render('webPage/singleEventShow.ejs',{currEvent});
})

// delete event
router.delete('/delete/:id',async (req, res)=>{
    const {id} = req.params;
    const data = await Events.findByIdAndDelete(id);
    res.redirect(`/event/${data.type}`);
})

//render edit form of event

router.get('/editForm/:id', async (req, res)=>{
    let {id} = req.params;
   
    let currEvent = await Events.findById(id);
    res.render('webPage/editEvent.ejs',{currEvent});
})


//update existing event
router.put('/edit/:id', validateEvent,                                                                                       async(req, res)=>{
    let {id} = req.params;
    let {events} = req.body;
    await Events.findByIdAndUpdate(id,{...events});
    res.redirect(`/event/show/${id}`);
})

router.get('/:type',async(req,res)=>{
    const type = req.params.type;
    let similarEvents = await Events.find({type:type});
    res.render('webPage/eventsShow.ejs',{similarEvents,type});
})


module.exports = router;
