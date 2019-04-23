// Set up and export a database model to store enclosure readings

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
	warm: {
		type: Number
	},
	cool: {
		type: Number
	},
	humidity: {
		type: Number
	}
});

const Reading = module.exports = mongoose.model('Reading', readingSchema);