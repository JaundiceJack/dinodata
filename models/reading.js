// Set up and export a database model to store enclosure readings

const mongoose = require('mongoose');

const readingSchema = mongoose.Schema({
	reptile_id: String,	//link to the reptile the reading is for
	date: {
		type: Date,
		required: true
	},
	warm: Number,
	cool: Number,
	humidity: Number
});

const Reading = module.exports = mongoose.model('Reading', readingSchema);


// TODO: I'll need to create date, warm pair objects to make sure the data goes under the right date
// Take a reading query result (an array of Reading objects)
// Generate 3 arrays of objects containing the date key and the data value
// Insert missing dates with the value "N/A" so there are no data gaps
// if a data type is not set for the date, set the value to "N/A"
// return an array of the requested data type or dates
// make sure dates are sorted, I guess make sure they're returned from the query in order
function makeDateString(dateObject) {
	if (typeof dateObject === Date) {
		let dateArray = dateObject.toUTCString().split(' ');
		return dateArray[2]+"-"+dateArray[1]+"-"+dateArray[3];
	}
}
module.exports.getArray = (readingsQuery, dataType) => {
	// Prepare an array to return
	let dataArray = [];
	// Check that a query was returned
	if (readingsQuery) {
		for (let reading in readingsQuery) {
			// Check the dataType and push the right string into dataArray
			if (dataType === 'dates') dataArray.push(makeDateString(reading.date));
			else if (dataType === 'cool' && !reading.cool ||
			 dataType === 'warm' && !reading.warm) {
				dataArray.push("N/A");
			}
			else if (true) {
				dataArray.push(reading.toString());
			}
		}
	}
	// Return the array to plot data
	return dataArray;
}


module.exports.getDates = (readings) => {
	let dates = []
	for (let i = 0; i < readings.length; i++) {
		dates.push(readings[i].date);
	}
	return dates;
}

module.exports.getWarmTemps = (readings) => {
	let warms = []
	for (let i = 0; i < readings.length; i++) {
		warms.push(readings[i].warm);
	}
	return warms;

}

module.exports.getCoolTemps = (readings) => {
	let cools = []
	for (let i = 0; i < readings.length; i++) {
		cools.push(readings[i].cool);
	}
	return cools;

}
