const mongoose = require('mongoose');

// Things to consider:
// What if a user has multiple snakes?
// What if they want to track frozen/prekilled/live prey?
// I've put a variable under 'food' to track frozen/live
// to track multiple snakes I'll need to change the user to have an array of snakes
// I've made a snake schema and replaced snakeName in users to an array of snakes
// Now what if the user wants to track multiple datapoints through the day?

// The Datum schema now contains a cage key,
// in the cage key, there is a readings key.
// readings is an array of Reading's.
// This way multiple readings can be taken over the course of a day.

// In the User schema, there is now an array of Snake schema in the snakes key.
// This allows the user to have multiple snakes

// No I need to make a foreign key or similar in the Datum schema, pointing to the snake it's associated with
// All readings must be associated with at least one snake

// I've added the ObjectId key to the Datum Schema refering to the Snakes Schema
// I think what I have is coming together, Next I should refine it and attempt reading/writing to the database.


let Reading = mongoose.Schema({
	time: {
		type: Date,
		required: true,
		default: Date.now();
	}
	warmSide: {
		type: Number
	}
	coolSide: {
		type: Number
	}
	humidity: {
		type: Number
	}

})

// Datum Schema
let Datum = mongoose.Schema({
	snakeId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Snakes',
		required: true
	} 
	date: {
		type: Date,
		required: true,
		default: Date.now()
	},
	cage: {
		readings: [Reading],
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
		},
		feederLife {
			type: String	//Can be frozen, prekilled, or live
		}
	}
})

let Snake = mongoose.Schema({
	name: {
		type: String,
		required: true
	}
	morph: {
		type: String
	}
	weight: {
		type: Number
	}
})

// Full Schema
let User = mongoose.Schema({
	name: {
		type: String,
		required: true
	}
	password: {
		type: String,
		required: true
	},
	preferences: {
		useCelsius: {
			type: Boolean,
			required: false
		}
	},
	snakes: [snake],
	data: [datum]
})

let james = new User({
	name: "james",
	password: "gandr",
	preferences: {
		useCelsius: true
	}
});

let jormun = new Snake({
	name: "jormun",
	morph: "Blue Eyed Leucistic"
});

james.snakes.push(jormun);

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