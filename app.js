const express = require('express');
require('dotenv').config();
const port = process.env.PORT || 4000;
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();

// Load routes
const ideasRoute = require('./routes/ideas');
const usersRoute = require('./routes/users');

// Passport Config
require('./config/passport')(passport);
// DB Config
const db = require('./config/database');

// Connect to mongoose
mongoose.connect(db.mongoURI, { 
    useNewUrlParser: true
})
.then(()=> console.log('MongoDB connected'))
.catch(function(err) {
    console.log(err);
})

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// For making put requests
app.use(methodOverride('_method'));

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// How middleware works?
app.use(function(req, res, next) {
    // console.log(Date.now());
    req.name = 'Kelmo';
    next();
})

app.get('/', (req, res) => {
    const title = 'Welcome1';
    res.render('index', {
        title: title
    });
})

app.get('/about', (req, res) => {
    res.render('about');
})

// Use routes
app.use('/users', usersRoute);
app.use('/ideas', ideasRoute);

app.listen(port, function() {
    console.log(`Server started on port ${port}`);
});