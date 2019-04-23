// Set up and export a database model to store reptile information

const mongoose = require('mongoose');

const reptileSchema = mongoose.Schema({
	// Key to owning user
	owner_id: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	feeding_day: {
		type: Date
	},
	last_fed: {
		type: Date
	},
	last_watered: {
		type: Date
	}
})

const Reptile = module.exports = mongoose.model('Reptile', reptileSchema);
