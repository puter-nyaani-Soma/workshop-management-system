const  mongoose = require('mongoose'); 
const Schema = mongoose.Schema
const Attendee = require('./attendee');
const workshopSchema = new Schema({
  Name: {
       type: 'string',
       
   },
  instructor:{
       type: 'string',
   },
   description:{
       type: 'string',
       
   },
   fee:{
    type: 'number',
   },
   maxLimit:{
    type:'number',
   },
   attendors:{
    type:[Attendee.Schema]
   }
 
},{timestamps:true})  

const Workshop = mongoose.model('Workshop',workshopSchema);
module.exports=Workshop;