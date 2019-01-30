// Load in dependancies
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const routes = require('./routes/index.js');

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

// Make some fake data for the chart
const fakeLowTempData = [77, 75, 76, 76, 78, 79, 78];
const fakeHighTempData = [88, 89, 90, 90, 87, 88, 88];
const fakeHumidData = [55, 57, 65, 59, 60, 67, 65];
const fakeTempChartLabels = ['1/3/19', '1/4/19', '1/5/19', '1/6/19', '1/7/19', '1/8/19', '1/9/19'];
const fakeHumidChartLabels = ['1/3/19', '1/4/19', '1/5/19', '1/6/19', '1/7/19', '1/8/19', '1/9/19'];


// Handle a GET request
app.get('/', (req, res) => {
	Models.user.findOne({name: 'james'}, (err, aUser) => {
		console.log('----- Start Basic Query -----');
		console.log(aUser.data[0]);
		console.log('----- End Basic Query -----');
	});
	Models.user.findOne({name: 'james'}).exec( (err, aUser) => {
		console.log('----- Start Data Query -----');
		console.log(aUser.data[0].reading);
		console.log('----- End Data Query -----');
		res.render('index', {
			snakeName: "Not Jormun",
			tempChartLabels: fakeTempChartLabels,
			lowTempData: fakeLowTempData,
			highTempData: fakeHighTempData,
			humidChartLabels: fakeHumidChartLabels,
			humidData: fakeHumidData
		});
	});
});

// Handle a GET request for Jormun
app.get("/jormun", (req, res) => {
	// Find the snake in the DB
	Models.user.findOne({name: 'james'}, (err, aUser) => {
		if (err) return console.error(err);
		// Render index.html to the client
		res.render('index', {
			snakeName: aUser.snakes[0].name,
			tempChartLabels: fakeTempChartLabels,
			lowTempData: fakeLowTempData,
			highTempData: fakeHighTempData,
			humidChartLabels: fakeHumidChartLabels,
			humidData: fakeHumidData
		});
	});
});

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
