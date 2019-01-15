const mongoose = require('mongoose');

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

let DatumSchema = mongoose.Schema({
	snakeId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'snakes',
		required: true
	},
	date: {
		type: Date,
		required: true,
		default: Date.now()
	},
	cage: {
		readings: [ReadingSchema],
		maintenance: {
			cageCleaned: {
				type: Boolean,
				default: false
			},
			bowlCleaned: {
				type: Boolean,
				default: false
			},
			bowlFilled: {
				type: Boolean,
				default: false
			}
		}
	},
	snake: {
		weight: {
			type: Number
		},
		length: {
			type: Number
		},
		shedToday: {
			type: Boolean,
			default: false
		},
		shedQuality: {
			type: Number
		}
	},
	food: {
		fedToday: {
			type: Boolean,
			default: false
		},
		feederType: {
			type: String
		},
		feederWeight: {
			type: Number
		},
		feederLife: {
			type: String	//Can be frozen, prekilled, or live
		}
	}
});

let SnakeSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	birthday: {
		type: Date
	},
	morph: {
		type: String
	},
	weight: {
		type: Number
	},
	length: {
		type: Number
	}
});

let UserSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	preferences: {
		useCelsius: {
			type: Boolean,
			default: true
		},
		useGrams: {
			type: Boolean,
			default: true
		},
		useCentimeters: {
			type: Boolean,
			default: true
		}
	},
	snakes: [SnakeSchema],
	data: [DatumSchema]
});

exports.user = mongoose.model('User', UserSchema);
exports.datum = mongoose.model('Datum', DatumSchema);
exports.reading = mongoose.model('Reading', ReadingSchema);
exports.snake = mongoose.model('Snake', SnakeSchema);
