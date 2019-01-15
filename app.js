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
let Models = require('./models/user');

/*
// Create a database entry for jormun
// Create a test user
let james = new Models.user({
	name: "james",
	password: "gandr",
	preferences: {
		useCelsius: true,
		useGrams: true,
		useCentimeters: true
	}
});

// Create a test snake
let jormun = new Models.snake({
	userId: james.id,
	name: "jormun",
	morph: "Blue Eyed Leucistic",
	weight: 240,
	length: 32
});
// Put the snake in the user file
james.snakes.push(jormun);
// Make 7 data, give them different days
let data = [0, 1, 2, 3, 4, 5, 6].map((day, index) => {
	return day = new Models.datum({
		date: new Date(1, (index+12), 2019),
		snakeId: jormun.id
	})
});
// Make one reading for each datum
for (let day = 0; day < data.length; day++){
	let reading = new Models.reading({
		time: Date.now(),
		warmSide: 36+day,
		coolSide: 27+day,
		humidity: 66+day
	});
	data[day].cage.readings.push(reading);
};
// Assign the test data to the test user and save to the database
james.data = data;
james.save().then(() => console.log("User: James, saved to HHDB"));
*/

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


function collectDateLabels(user, start, end){
	let labels = [];
	for(let i = 0; i < user.data.length; i++){
		let date = Date.parse(user.data[i].date).toString("MM-DD-YY");
		labels.push(date);
	}
	return labels;
}

Models.user.findOne({name: 'james'}, (err, user) => {
	console.log(user);
	console.log(collectDateLabels(user, 1, 2));
})


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
