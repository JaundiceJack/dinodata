// Load in dependancies
const Models = require('./models/user');

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

// Make 1 datum
let datum = new Models.datum({
	date: new Date(2019,0,29),
	snakeId: jormun.id,
	reading: [],
	maintenance: {
		cageCleaned: false,
		bowlCleaned: false,
		bowlFilled: false
	},
	snake: {
		weight: 210,
		length: 32,
		shedToday: false,
		shedQuality: 0
	},
	food: {
		fedToday: false,
		feederType: "N/A",
		feederWeight: 0,
		feederLife: "N/A"
	}
});
let reading = new Models.reading({
	time: Date.now(),
	warmSide: 92,
	coolSide: 77,
	humidity: 67
});
datum.reading.push(reading);
// Assign the test data to the test user
james.data.push(datum);

function saveUser(){
	let query = Models.user.find({name: 'james'}).exec( (err, users) => {
		if (users.length === 0) {
			console.log("Adding user: james...");
			james.save();
			console.log("james added to HHDB.");
		}
		else {
			console.log("Users already found in database. User: james not added.");
		}
	})
};


exports.saveUser = saveUser;