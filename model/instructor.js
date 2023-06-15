const  mongoose = require('mongoose'); 
const Schema = mongoose.Schema
const {isEmail}= require('validator');
const bcrypt = require('bcrypt');
const Workshop = require('./workshop')
const instructorSchema = new Schema({
   username: {
       type: 'string',
       required: [true, 'Please enter an Username'],
       unique: true,
   },
   password:{
       type: 'string',
       required:  [true, 'Please enter an Password'],
       minLength: [6, 'Please enter a Password with more than 6 letters'],
   },
   email:{
       type: 'string',
       required: [true, 'Please enter an email'],
       unique: true,
       lowercase:true,
       validate:[isEmail,'Please enter a valid email']
   },
   workshop:{
    type:[Workshop.Schema]
   }

 
},{timestamps:true})  

instructorSchema .pre('save', async function(next){
   const salt = await bcrypt.genSalt();
   this.password= await bcrypt.hash(this.password, salt)
   next();
});

instructorSchema.statics.login = async function (username,password) {
   const user = await this.findOne({ username});
   if(user){
     const auth=await bcrypt.compare(password, user.password);
     if(auth){
       return user;
     }
     throw Error('Incorrect Password');
   }
   throw Error('Incorrect Username');
 }

const Instructor = mongoose.model('Instructor',instructorSchema);
module.exports=Instructor;