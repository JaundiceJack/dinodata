const mongoose = require('mongoose');

// Test Schema
let snakeSchema = mongoose.Schema({
	userName: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	snakeName: {
		type: String
	}
})


// Full Schema
/*
let schema = mongoose.Schema({
	user: {
		userName: {
			type: String,
			required: true
		}
		password: {
			type: String,
			required: true
		},
		snakeName: {
			type: String,
			required: true
		},
		options: {
			useCelsius: {
				type: Boolean,
				required: false
			}
		}	
	},

	data: [{
		date: {
			type: Date,
			required: true
		},
		enclosure: {
			lowTemp: {
				type: Number
			},
			highTemp: {
				type: Number
			},
			humidity: {
				type: Number
			},
			cageCleaned: {
				type: Boolean
			},
			waterBowlCleaned: {
				type: Boolean
			},
			waterBowlFilled: {
				type: Boolean
			}
		},
		snake: {
			weight: {
				type: Number
			},
			shedToday: {
				type: Boolean
			},
			shedQuality: {
				type: Number
			}
		},
		food: {
			fedToday: {
				type: Boolean
			},
			feederType {
				type: String
			},
			feederWeight: {
				type: Number
			}
		}
	}]
})
*/

let Snake = module.exports = mongoose.model('Snake', snakeSchema);