// Load in dependancies
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const passport = require('passport');
const config = require('./config/database');

// Connect to MongoDB
mongoose.connect(config.database);
let db = mongoose.connection;
// Check connection
db.once('open', () => {	console.log('Connected to MongoDB'); });
// Check for database errors
db.on('error', (err) => { console.log(err); });
// Load in database models
let User = require('./models/user');

// Instantiate Express app
const app = express();
// Set the view location and view engine (pug)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// Set the location to serve static files (css/js)
app.use(express.static(path.join(__dirname, 'public')));

// Connect body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Express Session Middleware (keeps users logged in etc.)
app.use(session({
	secret: "abbabbabba",
	resave: true,
	saveUninitialized: true
}));

// Express Messages Middleware (in-window alerts)
app.use(flash());
app.use( (req, res, next) => {
	res.locals.messages = require('express-messages')(req, res);
	next();
});

// Express Validator Middleware
app.use(expressValidator({
	errorFormatter: (param, msg, value) => {
		let namespace = param.split('.');
		let root = namespace.shift();
		let formParam = root;

		while(namespace.length) {
			formParam += '['+namespace.shift()+']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		}
	}
}));

// Passport Configuration
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


// Route to the user pages
let user = require('./routes/profile');
app.use('/profile', user);
// Route to the monitoring pages
let monitoring = require('./routes/monitoring');
app.use('/monitoring', monitoring);
// Route to the home page
let home = require('./routes/home');
app.use('/home', home);


// Start the server
const port = 8080;
app.listen(port, () => {
	console.log('Server started on port '+port);
});
