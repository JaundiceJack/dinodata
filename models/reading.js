// Set up and export a database model to store enclosure readings

// Thoughts: I can establish temperature 1 as hottest and 2 as coldest, but some users may want to observe more than 2 points
// as well as humidities. So I'll add 10 of each. 20 is rediculous.


const mongoose = require('mongoose');

const readingSchema = mongoose.Schema({
	reptile_id: {
		type: String,	//link to the reptile the reading is for
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	temp_1: {
		type: Number
	},
	temp_2: {
		type: Number
	},
	humid_1: {
		type: Number,
		min: 0,
		max: 100
	},
	humid_2: {
		type: Number,
		min: 0,
		max: 100
	}
});

const Reading = module.exports = mongoose.model('Reading', readingSchema);