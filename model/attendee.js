const  mongoose = require('mongoose'); 
const Schema = mongoose.Schema
const Workshop=require('./workshop')
const {isEmail}= require('validator');
const bcrypt = require('bcrypt');
const attendeeSchema = new Schema({
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
   workshops:{
    type:[Workshop.Schema]
   }
 
},{timestamps:true})  

attendeeSchema .pre('save', async function(next){
   const salt = await bcrypt.genSalt();
   this.password= await bcrypt.hash(this.password, salt)
   next();
});

attendeeSchema.statics.login = async function (username,password) {
   const attendee = await this.findOne({ username});
   if(attendee){
     const auth=await bcrypt.compare(password, attendee.password);
     if(auth){
       return attendee;
     }
     throw Error('Incorrect Password');
   }
   throw Error('Incorrect Username');
 }

const Attendee = mongoose.model('Attendee',attendeeSchema);
module.exports=Attendee;