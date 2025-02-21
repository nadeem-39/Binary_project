
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const memberRoute = require('./routes/memberRoute');
const eventRoute = require('./routes/eventRoute');
const Members = require('./models/memberSchma.js');



app.set('view engine','ejs');
app.set('views',path.join(__dirname,'view'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);





async function main(){
   await mongoose.connect('mongodb://127.0.0.1:27017/binaryClub');
}

main().then(()=>{
    console.log("database successfully connected");
}).catch((err)=>{
    console.log(err);
})



//home page request

app.get('/',async(req,res)=>{
    let memberData = await Members.find({});
    // console.log(memberData);
    // console.log(`Ip address of client ${req.ip}`);

    res.render('webPage/homePage.ejs',{memberData});
})


//member new form
app.use('/member',memberRoute);




//evnet new form 
app.use('/event',eventRoute);






//* route
app.all('*',(req,res,next)=>{
    next(new ExpressError(404,'page not found'));
})

app.use((err,req,res,next)=>{
    let{status, message} =err;
    if(!status) status = 500;
    res.status(status).render('error/error.ejs', {message});
})



app.listen(8080,()=>{
    console.log('listing port 8080');
})