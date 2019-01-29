const mongoose = require('mongoose');

let ReadingSchema = mongoose.Schema({
	time: Date,
	warmSide: Number,
	coolSide: Number,
	humidity: Number
});

let DatumSchema = mongoose.Schema({
	// Since a user may have multiple snakes, record which snake the datum is for.
	snakeId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'snakes',
		required: true
	},
	// Record the date the data was taken.
	date: {
		type: Date,
		required: true,
		default: Date.now()
	},
	// Take a reading for cool & warm temperatures and the humidity.
	// I've changed this from an array of readings to a flat reading
	// I did this because when I was trying to query, I'd keep getting arrays of objects that I couldn't access
	// I would like to change it back though, so that up to 24 readings may be taken in a day
	/*
	readings: [readingSchema] <-time, warmSide, coolSide, humidity
	 */
	reading: [ReadingSchema],
	// Record what cage maintenance was done for the day.
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
	},
	// Record snake details.
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
	// If the snake was fed, record feeder details.
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
