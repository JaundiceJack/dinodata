const mongoose = require('mongoose');
const ReadingSchema = require('./reading');

let DatumSchema = mongoose.Schema({
	snakeId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Snakes',
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

let Datum = module.exports = mongoose.model('Datum', DatumSchema);
