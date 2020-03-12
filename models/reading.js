const mongoose = require('mongoose');

const readingSchema = mongoose.Schema({
	reptile_id: {
		type: String,	//link to the reptile the reading is for
		required: true
	},
	date: {
		type: String,
		required: true
	},
	time: {
		type: Number,
		required: true,
		min: 0,
		max: 23

	},
	warmest: {
		type: Number
	},
	coldest: {
		type: Number
	},
	humidity: {
		type: Number,
		min: 0,
		max: 100
	}
});

// Define the pairing of id, date, and time as unique entries
readingSchema.index({reptile_id: 1, date: 1, time: 1}, {unique: true});


const Reading = module.exports = mongoose.model('Reading', readingSchema);