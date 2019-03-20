// Load in dependancies
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/hebihibidb');
let db = mongoose.connection;
// Check connection
db.once('open', () => {	console.log('Connected to MongoDB'); });
// Check for database errors
db.on('error', (err) => { console.log(err); });
// Load in database models
let Models = require('./models/user');

// Instantiate Express
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

//Perform a test entry to the Database
const test = require('./test');
test.saveUser();

// TODO begin breaking the site up into more manageable routes
// The users route should handle account creation and user settings
// The monitoring route should handle info, cage, and food pages
// Since the monitoring pages will depend on user verification,
// I'll have to factor it in somehow

// Handle a GET request for the home page
app.get('/', (req, res) => {
	res.render('index', {});
});

// Route to the user pages
let user = require('./routes/profile');
app.use('/profile', user);

// Route to the monitoring pages
let monitoring = require('./routes/monitoring');
app.use('/monitoring', monitoring);




// Test out data submission
app.post("/cage/submit", (req, res, next) => {
	// Gather reading data from user input
	const webReading = new Models.reading({
		time: Date.now(),
		coolSide: req.body.coolSide,
		warmSide: req.body.warmSide,
		humidity: req.body.humidity
	});

	// Update user james with the new readings
	Models.user.updateOne(
		{name: 'james'},
		{$push: { 'data.0.reading': webReading}}
		).exec( (err, aUser) => {
			if (err) return console.log(err);
			console.log("Data submitted.");
		}
	);

	// Reroute to the homepage
	res.redirect('/');

	// Find out how to render with CSS after a post.
});

// Start the server
const port = 8080;
app.listen(port, () => {
	console.log('Server started on port '+port);
});
