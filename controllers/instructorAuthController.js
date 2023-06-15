const Instructor = require('../model/instructor')
const jwt=require('jsonwebtoken')
const maxAge = 60*60;

const createToken =(id)=>{
return jwt.sign({ id },'soma secret',{ 
    expiresIn: maxAge
});
}
const handleErrors1 = (err) =>{
    
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
    if(err.message.includes('Instructor validation failed')){
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
        const instructor =await Instructor.create({email: email,username: username,password:password});
        const token =  createToken(instructor._id);
        console.log(req.body)
        res.cookie('jwt',token,{ httpOnly:true, maxAge:1000*60*60})
        res.status(201).send({instructor:instructor._id});
             
          }
          catch(err){
            console.log("in")
             const errors1 = handleErrors1(err);
             console.log(errors1)
              res.status(400).json({errors1});
              console.log(err)
          }
         
           
        }
module.exports.login_post=async (req, res) => {
    const { username, password } = req.body;
        try {
          const instructor = await Instructor.login(username, password);
          const token = createToken(instructor._id);
          res.cookie('jwt',token,{ httpOnly:true, maxAge:1000*60*60})
          res.status(200).json({ instructor:instructor._id });
          
        } catch (err) {
          const errors1=handleErrors1(err);
          res.status(400).json({errors1});
        }
      }

module.exports.logout_get = (req,res) => {
        res.cookie('jwt','',{maxAge:1})
        res.redirect('/home')
    }
module.exports.login_get = (req,res) => {
    res.render('./instructorLogin.ejs',{root:(__dirname)})
}