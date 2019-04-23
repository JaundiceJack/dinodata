const mongoose = require('mongoose');

let feedingSchema = mongoose.Schema({
	reptile_id: {
		type: String,
		required: true
	},
	day_fed: {
		type: Date
	}
	food_category: {
		type: String
	}
	food_subcategory: {
		type: String
	}
	food_weight: {
		type: Number
	}
	live_feeder: {
		type: Boolean,
		default: false
	}
});

const Feeding = module.exports = mongoose.model('Feeding', feedingSchema);