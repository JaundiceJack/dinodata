// Load in dependancies
const express = require('express');
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
let Snake = require('./models/snake');

// Create a database entry for jormun
//let jormun = new Snake({userName: "james", password: "gandr", snakeName: "jormun"});
//jormun.save().then(() => console.log("Jormun saved to HHDB"));

// Instantiate Express
const app = express();
// Set the view location and view engine (pug)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// Set the location to serve static files (css/js)
app.use(express.static(path.join(__dirname, 'public')));



// Make some fake data for the chart
const fakeLowTempData = [77, 75, 76, 76, 78, 79, 78];
const fakeHighTempData = [88, 89, 90, 90, 87, 88, 88];
const fakeHumidData = [55, 57, 65, 59, 60, 67, 65];
const fakeTempChartLabels = ['1/3/19', '1/4/19', '1/5/19', '1/6/19', '1/7/19', '1/8/19', '1/9/19'];
const fakeHumidChartLabels = ['1/3/19', '1/4/19', '1/5/19', '1/6/19', '1/7/19', '1/8/19', '1/9/19'];
// I got the fake data to render (client-side) by passing it in just like i did with Jormun's name
// So now I'd like to set up how much data to display at once as a guideline of how many days to request and all that
// I'd like to have some editable options
// Days to display: 7, 14, 28, All=0
let daysToDisplay = 7;
let minTemp = 75;
let maxTemp = 95;
let minHumid = 55;
let maxHumid = 85;


// Handle a GET request
app.get('/', (req, res) => {
	res.render('index', {
		snakeName: "Not Jormun"
	});
});

// Handle a GET request for Jormun
app.get("/jormun", (req, res) => {
	// Obtain the snake in the URL
	let name = req.url.substr(1);
	// Find the snake in the DB
	Snake.findOne({snakeName: name}, (err, snake) => {
		if (err) return console.error(err);
		// Render index.html to the client
		res.render('index', {
			snakeName: snake.snakeName,
			tempChartLabels: fakeTempChartLabels,
			lowTempData: fakeLowTempData,
			highTempData: fakeHighTempData,
			humidChartLabels: fakeHumidChartLabels,
			humidData: fakeHumidData
		});
	});
})

/*
From the previous get request, I can see that you first instantiate the model,
then you can handle the request first, query the model/DB second, and pass the found data
to the rendering third, all neatly nested in callbacks.
How does it complicate once I move the routes outside of this file though?
*/

// Start the server
const port = 8080;
app.listen(port, () => {
	console.log('Server started on port '+port);
});
