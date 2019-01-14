const mongoose = require('mongoose');
const SnakeSchema = require('./snake');
const DatumSchema = require('./datum');

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

let User = module.exports = mongoose.model('User', UserSchema);
