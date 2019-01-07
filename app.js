// Load in dependancies
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const routes = require('./routes/index.js');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/hebihibidb');
let db = mongoose.connection;

// Check connection
db.once('open', () => {
	console.log('Connected to MongoDB');
});

// Check for database errors
db.on('error', (err) => {
	console.log(err);
});

// Load in database models
let Users = mongoose.model('Users', {snakeName: String});
//let Users = require('./models/users');


// Instantiate Express
const app = express();

// Set the view location and view engine (pug)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set the location to serve static files (css/js)
app.use(express.static(path.join(__dirname, 'public')));

const query = Users.findOne({snakeName: "Jormun"});
query.select('snakeName');
var jormun = ""
query.exec((err, snake) => {
	if (err) return console.error(err);
	jormun = snake.snakeName;
});

console.log(jormun);


// Handle a GET request
app.get('/', (req, res) => {
	res.render('index', {
		snakeName: "Not Jormun"
	});
});

// Start the server
const port = 8080;
app.listen(port, () => {
	console.log('Server started on port '+port);
});