const mongoose = require('mongoose');

// So, limiting the possible reading creations to one per hour
// A warmest point, a coldest point, and a humidity at base

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

const Reading = module.exports = mongoose.model('Reading', readingSchema);