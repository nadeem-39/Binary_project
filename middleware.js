const express = require('express');
const app = express();
const {memberSchemaValidateFunct, eventSchemaValidateFunct} = require('./schemaValidation/schemaValidateFile.js');
const ExpressError = require('./utils/ExpressError.js');
const flash = require('connect-flash');

app.use(flash());





//flash messages



//validate function member
module.exports.validateMember = (req ,res, next)=>{
    let  {error} = memberSchemaValidateFunct.validate(req.body);
    if(error){
     throw new ExpressError(error);
    }
    next();
 
 }


 //validate function enent

 module.exports.validateEvent = (req, res, next)=>{
    let {error} = eventSchemaValidateFunct.validate(req.body);
    if(error){
        throw new ExpressError(error);
    }
    next();
 }