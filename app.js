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

// Create and save a document Jormun
//let jormun = new Snake({
//	userName: "James",
//	password: "emptybox",
//	snakeName: "Jormun"
//});

// Save Jormun to the DB
//jormun.save((err, snake) => {
//	if (err) return console.error(err);
//	console.log("Jormun saved to HebiHibiDB");
//});

// Create a query to the DB for Jormun
//const query = Snake.find({snakeName: "Jormun"});

// Select the snakeName field
//query.select('snakeName');

// Execute the query to retrieve his name
//query.exec( (err, snake) => {
//	console.log(snake.snakeName);
//})

// Instantiate Express
const app = express();

// Set the view location and view engine (pug)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set the location to serve static files (css/js)
app.use(express.static(path.join(__dirname, 'public')));

// Handle a GET request
app.get('/', (req, res) => {
	res.render('index', {
		snakeName: "Not Jormun"
	});
});

// Handle a GET request for Jormun
app.get("/jormun", (req, res) => {
	// Obtain the snake in the URL
	let name = req.url.substr(1)
	name = name.charAt(0).toUpperCase() + name.substr(1);
	// Find the snake in the DB
	Snake.findOne({snakeName: name}, (err, snake) => {
		if (err) return console.error(err);
		// Render index.html to the client
		res.render('index', {
			snakeName: snake.snakeName
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