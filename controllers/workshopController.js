const Workshop = require('../model/workshop')
const Attendee = require('../model/attendee')
const Instructor = require('../model/instructor')
module.exports.add_workshop_get = (req,res) =>{
res.render('./addworkshop.ejs')
}
module.exports.add_workshop_post =async (req,res) =>{
    console.log(req.body);
    const workshop = new Workshop(req.body)
    workshop.save()
    .then((result) =>{
    })
    .catch((err) => {
        console.log(err);  
    })
    let filter={username:req.body.instructor}
    let update ={$push:{workshop:req.body.Name}}
    await Instructor.updateOne(filter, update)
    res.redirect('/allworkshops_i')
    
    
  }
  module.exports.all_workshops_post_a = async (req, res) =>{
    let filter={_id:req.body.id}
    let update ={$push:{attendors:req.body.Name}}
    await Workshop.updateOne(filter, update);
    await Workshop.updateOne(filter,{$inc:{maxLimit:-1}});
    await Attendee.updateOne({username:req.body.Name},{$push:{workshops:req.body.wName}})

    res.redirect('/home')
  }
module.exports.del_workshop = (req,res) =>{

    const id = req.body.id;
    
    Workshop.findByIdAndDelete(id)
      .then(result => {
        res.redirect('/allworkshops_i');
        
      })
      .catch(err => {
        console.log(err);
      });
    }
   

module.exports.all_workshops_get_i = (req,res) =>{
    Workshop.find({instructor:res.locals.instructor.username})
    .then((workshop) =>{
        res.render('./allworkshops.ejs',{workshops:workshop});

    })
}
module.exports.all_workshops_get_a = (req,res) =>{
  if(res.locals.attendee){
  Workshop.find().sort({createdAt: -1})
  .then((workshop) =>{
      res.render('./allworkshops_a.ejs',{workshops:workshop});

  })
}
else{
  res.render('./login.ejs')
}
}
module.exports.my_workshops_get = (req, res) =>{

  Workshop.find({attendors:res.locals.attendee.username})
  .then((Workshop) =>{
    res.render('./myworkshops.ejs',{workshops:Workshop})
  })
}