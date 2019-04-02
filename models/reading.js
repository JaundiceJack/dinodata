// Set up and export a database model to store enclosure readings

const mongoose = require('mongoose');

const readingSchema = mongoose.Schema({
	reptile_id: String,
	date: Date,
	warm: Number,
	cool: Number,
	humidity: Number
})

const Reading = module.exports = mongoose.model('Reading', readingSchema);