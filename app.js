const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require('express-session');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const flash = require('connect-flash');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campground')
const reviewRoutes = require('./routes/reviews');

mongoose
    .connect("mongodb://127.0.0.1:27017/yelp-camp")
    .then(() => {
        console.log("DATABSE CONNECTED!!");
    })
    .catch((err) => {
        console.log("MONGO CONNECTION ERROR!!!!");
        console.log(err);
    });

const app = express();

app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeuser', async (req, res) => {
    const user = new User({email: 'devendra@gmail.com', username: 'dev'});
    const newUser = await User.register(user, 'gt650');
    res.send(newUser);
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get("/", (req, res) => {
    res.render("home");
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something is wrong!!';
    res.status(statusCode).render("error", { err })
})


app.listen(3000, () => {
    console.log("On the PORT http://localhost:3000/");
});
