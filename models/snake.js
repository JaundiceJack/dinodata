const mongoose = require('mongoose');

let SnakeSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Users",
		required: true
	},
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

let Snake = module.exports = mongoose.model('Snake', SnakeSchema);
