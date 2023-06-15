const jwt = require('jsonwebtoken')
const Instructor = require('../model/instructor')
const irequireAuth = (req,res,next) =>{
    const token = req.cookies.jwt;
    //check if jwt exists and verified
    if(token){
        jwt.verify(token,'soma secret',(err,decodedToken) =>{
            if(err){
                console.log(err.message)
                res.redirect('/login');
            }
            else{
                console.log(decodedToken);
                next();
            }

        })
    }
    else{
        console.log("not loggedin")
        res.redirect('/login');
    
    }
}
//checking user
const icheckUser=(req,res,next)=>{
    const token = req.cookies.jwt;
    //check if jwt exists and verified
    if(token){
        jwt.verify(token,'soma secret',async (err,decodedToken) =>{
            if(err){
                console.log(err.message);
                res.locals.instructor=null;
                next();
            }
            else{
                console.log(decodedToken);
                let instructor= await Instructor.findById(decodedToken.id)
                res.locals.instructor=instructor;
                next();
            }

        })
    }
    else{
        res.locals.instructor=null;
        next();
    }
}
const isAdmin =(req,res,next) => {
        
    if(!res.locals.user.isAdmin){
        res.redirect('/403')
    }
    else{
        next();
    }
}
module.exports = {irequireAuth,icheckUser,isAdmin}