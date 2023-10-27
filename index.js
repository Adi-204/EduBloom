import express from 'express';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import passportLocalMongoose from 'passport-local-mongoose';
import 'dotenv/config';

const app = express();
const port = 3000;
var sessions = [
    {
        topic:"Level up your chemistry teaching",
        mode:"Offline",
        duration:"2hr",
        speaker:"Alcha Verma",
        speaker_details:"Expertise in Gamified Chemistry teaching"
    },
    {
        topic:"Level up your Mathematics teaching",
        mode:"Online",
        duration:"3hr",
        speaker:"Sangeeta Gupta",
        speaker_details:"She is expert at teaching Mathematics with usage of AI tools"
    },
    {
        topic:"How to increase quailty of Content",
        mode:"Offline",
        duration:"4hr",
        speaker:"Rohan Kumar",
        speaker_details:"Expert at recording online lectures with 5 Million Subscriber on Youtube"
    },
    {
        topic:"How to Gamify Coding",
        mode:"Offline",
        duration:"2hr",
        speaker:"Harsh Singh",
        speaker_details:"Expert in making life of students easy."
    },
    {
        topic:"Level up your Social Media Portfolio",
        mode:"Online",
        duration:"2.5hr",
        speaker:"Sandeep Verma",
        speaker_details:"Expert at building personal social portfolio"
    },
    {
        topic:"Digital Marketing",
        mode:"Online",
        duration:"1.5hr",
        speaker:"Sandeep Verma",
        speaker_details:"Expert at how to promote your courses online and increse more engaement"
    },
    {
        topic:"Remove fear of Camera Shyness",
        mode:"Online",
        duration:"3hr",
        speaker:"Soham Sign",
        speaker_details:"Expert at how to remove fear of camera shyness and boost your confidence to record lectures"
    },
    {
        topic:"Level up your physics teaching",
        mode:"Online",
        duration:"2.5hr",
        speaker:"Walter Lewin",
        speaker_details:"He is expert at teaching difficult concepts and provide quailty content to students"
    }
];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: process.env.SECRETE_KEY,
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://127.0.0.1:27017/eduBloomUsersDB');

const userSchema = new mongoose.Schema({
    username:String,
    email : String,
    password : String,
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User',userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/courses',(req,res)=>{
    res.render('courses');
});

app.get('/signin',(req,res)=>{
    res.render('signin');
});

app.get('/signup',(req,res)=>{
    res.render('signup');
});

app.get('/sessions',(req,res)=>{
    res.render('sessions',{arr:sessions});
});

app.get('/about',(req,res)=>{
    res.render('about');
});

app.post('/process-filter',(req,res)=>{
    const modefill = req.body.mode;
    if(modefill==="all"){
        res.render('sessions',{arr:sessions});
    }else{
        const newSessions = sessions.filter((ele)=> ele.mode === modefill);
        res.render('sessions',{arr:newSessions});
    }
});

app.post('/signin', passport.authenticate('local', {
    successRedirect: '/', 
    failureRedirect: '/signin',
}));

app.post('/signup',(req,res)=>{
    const { username, email, password } = req.body;
    User.register(new User({ username, email }), password, (err, user) => {
        if (err) {
            console.error(err);
            res.redirect('/signup');
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/');
        });
    });
});

app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
});

