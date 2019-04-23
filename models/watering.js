const mongoose = require('mongoose');

let wateringSchema = mongoose.Schema({
	reptile_id: {
		type: String,
		required: true
	},
	day_watered: {
		type: Date
	}
});

const Watering = module.exports = mongoose.model('Watering', wateringSchema);