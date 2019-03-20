// Load in dependancies
const User = require('./models/user');

// Create a test user
let james = new User({
	username: "james",
	password: "gandr",
	email: "jamesmcneilan@protonmail.com"
});


function saveUser(){
	let query = User.find({name: 'james'}).exec( (err, users) => {
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
