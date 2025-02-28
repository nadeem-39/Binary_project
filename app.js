
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const memberRoute = require('./routes/memberRoute');
const eventRoute = require('./routes/eventRoute');
const userRoute = require('./routes/userRoute');
const Members = require('./models/memberSchma.js');
const session = require('express-session');
const sessionOption = {
    secret:"mysecretsuperstring",
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true
    }
};
const flash = require('connect-flash');
const passport = require('passport');
const LocalStratergy = require('passport-local');
const User = require('./models/userSchema.js');



app.set('view engine','ejs');
app.set('views',path.join(__dirname,'view'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);

app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






async function main(){
   await mongoose.connect('mongodb://127.0.0.1:27017/binaryClub');
}

main().then(()=>{
    console.log("database successfully connected");
}).catch((err)=>{
    console.log(err);
})



app.use((req,res,next)=>{
    res.locals.successMsg = req.flash('success');
    res.locals.errorMsg = req.flash('error');
    next();
});

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

// userRoute 
app.use('/user',userRoute);






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