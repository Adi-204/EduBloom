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

mongoose.connect('mongodb://127.0.0.1:27017/eduBloomSessionsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sessionSchema = new mongoose.Schema({
    topic: String,
    mode: String,
    duration: String,
    speaker: String,
    speaker_details: String,
});

const Session = mongoose.model('Session', sessionSchema);

const videoSchema = new mongoose.Schema({
    title: String,
    url: String,
});

const Video = mongoose.model('Video', videoSchema);

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

app.get('/DME',async (req,res)=>{
    const course_name = "Digital Marketing for Educators";
    try {
        const videos = await Video.find({title : course_name});
        res.render('DME', { v:videos });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving videos');
    }
});

app.get('/A_to_z',async (req,res)=>{
    const course_name = "Reach the zenith of 21st century educators";
    try {
        const videos = await Video.find({title : course_name});
        res.render('A_to_z', { v:videos });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving videos');
    }
});
app.get('/Gamification',async (req,res)=>{
    const course_name = "Gamification in Education";
    try {
        const videos = await Video.find({title : course_name});
        res.render('Gamification', { v:videos });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving videos');
    }
});
app.get('/Innovative',async (req,res)=>{
    const course_name = "Innovative Teaching Practices";
    try {
        const videos = await Video.find({title : course_name});
        res.render('Innovative', { v:videos });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving videos');
    }
});
app.get('/Chatgpt',async (req,res)=>{
    const course_name = "ChatGPT and AI tools";
    try {
        const videos = await Video.find({title : course_name});
        res.render('Gamification', { v:videos });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving videos');
    }
});
app.get('/SEO',async (req,res)=>{
    const course_name = "Search Engine Optimization";
    try {
        const videos = await Video.find({title : course_name});
        res.render('SEO', { v:videos });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving videos');
    }
});
app.get('/signin',(req,res)=>{
    res.render('signin');
});

app.get('/signup',(req,res)=>{
    res.render('signup');
});

app.get('/sessions', async (req, res) => {
    try {
        const sessions = await Session.find({});
        res.render('sessions', { arr: sessions });
    } catch (err) {
        console.error('Error retrieving sessions:', err);
        res.status(500).send('Error retrieving sessions');
    }
});

app.get('/about',(req,res)=>{
    res.render('about');
});

app.post('/process-filter', async (req, res) => {
    const modeFilter = req.body.mode;
    try {
        if (modeFilter === 'all') {
            const sessions = await Session.find({});
            res.render('sessions', { arr : sessions });
        } else {
            const filteredSessions = await Session.find({ mode: modeFilter });
            res.render('sessions', { arr: filteredSessions });
        }
    } catch (err) {
        console.error('Error retrieving or filtering sessions:', err);
        res.status(500).send('Error retrieving or filtering sessions');
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

