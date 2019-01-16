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

// Assign the test data to the test user
james.data = data;

function saveUser(){
	console.log("Executing user purge and save...");
	Models.user.findOne({name: 'james'}).remove();
	james.save().then(() => console.log("User: James, saved to HHDB."));
};

function checkUser(){
	console.log("Executing user search...");
	Models.user.findOne({name: 'james'}, (err, user) => {
		if(user != null && user.password === 'gandr'){
			console.log('User: James, found in HHDB.');
		} else {
			console.log()
		}
	})
}

exports.saveUser = saveUser;
exports.checkUser = checkUser;
