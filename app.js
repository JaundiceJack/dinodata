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
//const test = require('./test');
//test.checkUser();
//test.saveUser();

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

/*
function collectDateLabels(user, start, end){
	let labels = [];
	for(let i = 0; i < user.data.length; i++){
		let date = Date.parse(user.data[i].date).toString("MM-DD-YY");
		labels.push(date);
	}
	return labels;
}
*/

// Handle a GET request for Jormun
app.get("/jormun", (req, res) => {
	// Find the snake in the DB
	Models.user.findOne({name: 'james'}, (err, user) => {
		if (err) return console.error(err);
		// Render index.html to the client
		res.render('index', {
			snakeName: user.snakes[0].name,
			tempChartLabels: fakeTempChartLabels,
			lowTempData: fakeLowTempData,
			highTempData: fakeHighTempData,
			humidChartLabels: fakeHumidChartLabels,
			humidData: fakeHumidData
		});
	});
})

app.get("/cage/submit", (req, res) => {
	res.render('index', {
		snakeName: 'submit test',
		tempChartLabels: fakeTempChartLabels,
		lowTempData: fakeLowTempData,
		highTempData: fakeHighTempData,
		humidChartLabels: fakeHumidChartLabels,
		humidData: fakeHumidData
	})
});

app.post("/cage/submit", (req, res) => {
	// Gather reading data from user input
	const reading = new Models.reading({
		coolSide: req.body.coolSide,
		warmSide: req.body.warmSide,
		humidity: req.body.humidity
	});


	// Find and print all current users
	Models.user.find({}, (err, users) => {
		console.log(users);
	});

	// Find and print james's data
	Models.user.findOne({name: 'james'}).populate('data').exec( (err, user) => {
		if (err) return console.log(err);

		console.log(user.data);
	});

	// Find out how to render with CSS after a post.
})


/*
From the previous get request, I can see that you first instantiate the model,
then you can handle the request first, query the model/DB second, and pass the found data
to the rendering third, all neatly nested in callbacks.
How does it complicate once I move the routes outside of this file though?
*/

// Start the server
const port = 8081;
app.listen(port, () => {
	console.log('Server started on port '+port);
});
