const Attendee = require('../model/attendee')
const jwt=require('jsonwebtoken')
const maxAge = 60*60;

const createToken =(id)=>{
return jwt.sign({ id },'soma secret',{ 
    expiresIn: maxAge
});
}
const handleErrors = (err) =>{
    
    let errors1 = {email:'',username:'',password:''};
    console.log(err.message,err.code);

    //duplicate error
    if(err.code ===11000){
       if(err.message.includes('email')){
        errors1['email']='email already in use';
       }
       if(err.message.includes('username')){
        errors1['username']='username already in use';
       }
   }

    // validation errors
    if(err.message.includes('Attendee validation failed')){
        Object.values(err.errors).forEach(({properties}) =>{
            errors1[properties.path]= properties.message;
        });
    }

    //incorrect creds
    if(err.message.includes('Incorrect Password')){
        errors1['password']='Check your password!!!!'
    }
    if(err.message.includes('Incorrect Username')){
        errors1['username']='Check your username!!!!!'
    }
    return errors1
}
module.exports.signup_post=async(req,res)=>{

    const {email,username,password}=req.body;
    console.log("hi",req.body);
    try{
        const attendee =await Attendee.create({email: email,username: username,password:password});
        const token =  createToken(attendee._id);
        console.log(req.body)
        res.cookie('jwt',token,{ httpOnly:true, maxAge:1000*60*60})
        res.status(201).send({attendee:attendee._id});
      
             
          }
          catch(err){
            console.log("in")
             const errors1 = handleErrors(err);
             console.log(errors1)
              res.status(400).json({errors1});
              console.log(err)
          }
         
           
        }
module.exports.login_post=async (req, res) => {
    const { username, password } = req.body;
        try {
          const attendee = await Attendee.login(username, password);
          const token = createToken(attendee._id);
          res.cookie('jwt',token,{ httpOnly:true, maxAge:1000*60*60})
          res.status(200).json({ attendee:attendee._id });
          
        } catch (err) {
          const errors1=handleErrors(err);
          res.status(400).json({errors1});
        }
      }

module.exports.logout_get = (req,res) => {
        res.cookie('jwt','',{maxAge:1})
        res.render('./Login.ejs',{root:(__dirname)})
    }
module.exports.login_get = (req,res) => {
    res.render('./Login.ejs',{root:(__dirname)})
}