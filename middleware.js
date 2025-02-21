const {memberSchemaValidateFunct, eventSchemaValidateFunct} = require('./schemaValidation/schemaValidateFile.js');
const ExpressError = require('./utils/ExpressError.js');


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