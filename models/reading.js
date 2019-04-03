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


// TODO: I'll need to create date, warm pair objects to make sure the data goes under the right date
module.exports.getDates = function(readings) {
	let dates = []
	for (let i = 0; i < readings.length; i++) {
		dates.push(readings[i].date);
	}
	return dates;
}

module.exports.getWarmTemps = function(readings) {
	let warms = []
	for (let i = 0; i < readings.length; i++) {
		warms.push(readings[i].warm);
	}
	return warms;

}

module.exports.getCoolTemps = function(readings) {
	let cools = []
	for (let i = 0; i < readings.length; i++) {
		cools.push(readings[i].cool);
	}
	return cools;

}