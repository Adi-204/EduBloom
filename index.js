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
    res.render('sessions');
});

app.get('/about',(req,res)=>{
    res.render('about');
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

