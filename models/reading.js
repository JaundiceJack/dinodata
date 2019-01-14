const mongoose = require('mongoose');

// Reading Schema (for Datum)
let ReadingSchema = mongoose.Schema({
	time: {
		type: Date,
		required: true,
		default: Date.now()
	},
	warmSide: {
		type: Number
	},
	coolSide: {
		type: Number
	},
	humidity: {
		type: Number
	}
});

let Reading = module.exports = mongoose.model('Reading', ReadingSchema);
