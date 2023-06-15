//required imports
const express = require('express');

const mongoose = require('mongoose');

const morgan = require('morgan')

const app = express();

const cookieParser = require('cookie-parser');

const session = require('express-session');

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(session({
    secret: 'soma secret',
    resave: false,
    saveUninitialized: true,
}));
app.use(express.urlencoded({ extended: true }))

mongoose.connect('mongodb://127.0.0.1:27017/workshopNew', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', (err) => {
    console.log(err)
})
db.once('open', () => {
    console.log('DB Connection Established!')
})
app.listen(3000)

const instructorRoutes = require('./routes/instructorRoutes')
const attendeeRoutes = require('./routes/attendeeRoutes')
const workshopRoutes = require('./routes/workshopRoutes')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')
const { irequireAuth, icheckUser } = require('./middleware/instructorMiddleware')
app.get('*', checkUser);
app.get('*',icheckUser);
app.set('view engine', 'ejs');

app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});


const Instructor = require('./model/instructor');
const Attendee = require('./model/attendee');
const Workshop = require('./model/workshop');
app.use(express.static('./static'))


app.use(express.urlencoded({ extended: true }))
app.use(instructorRoutes)
app.use(attendeeRoutes)
app.use(workshopRoutes)


app.get('/home',(req,res)=>{
    if(res.locals.instructor){

        res.redirect('/allworkshops_i')
    }
    else{
        res.redirect('/allworkshops_a')
        
    }

})
app.get('/about-us',(req,res)=>{
    res.render('./aboutus.ejs')
})