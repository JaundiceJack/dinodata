const mongoose = require('mongoose');

// Datum Schema
let datum = mongoose.Schema({
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
		feederType {
			type: String
		},
		feederWeight: {
			type: Number
		}
	}
})

// Full Schema
let user = mongoose.Schema({
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
	},
	data: [datum]
})

let jormun = new user();
jormun.userName = "james";
jormun.password = "gandr";
jormun.snakeName = "jormun";
jormun.options.useCelsius = true;

let firstDay = new datum();
firstDay.date = "01/10/2019";
firstDay.enclosure.lowTemp = 75;
firstDay.enclosure.highTemp = 88;
firstDay.enclosure.humidity = 66;
firstDay.enclosure.cageCleaned = false;
firstDay.enclosure.waterBowlCleaned = false;
firstDay.enclosure.waterBowlFilled = false;
firstDay.snake.weight = 225;
firstDay.snake.shedToday = false;
firstDay.snake.shedQuality = null;
firstDay.food.fedToday = false;
firstDay.food.feederType = null;
firstDay.feederWeight = null;

jormun.data.push(firstDay);

let secondDay = new datum({
	date: "01/11/19",
	enclosure: {
		lowTemp: 76,
		highTemp: 89,
		humidity: 67,
		cageCleaned: false,
		waterBowlCleaned: true,
		waterBowlFilled: true
	}
	snake: {
		weight: null,
		shedToday: false,
		shedQuality: null
	}
	food: {
		fedToday: true,
		feederType: "rat",
		feederWeight: 19
	}
});

jormun.data.push(secondDay);


let Snake = module.exports = mongoose.model('Snake', snakeSchema);