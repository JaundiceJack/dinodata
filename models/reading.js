// Set up and export a database model to store enclosure readings

const mongoose = require('mongoose');

const readingSchema = mongoose.Schema({
	reptile_id: String,	//link to the reptile the reading is for
	date: {
		type: Date,
		required: true
	},
	warm: Number,
	cool: Number,
	humidity: Number
});

const Reading = module.exports = mongoose.model('Reading', readingSchema);