// Obtain a string representing the current date
function getCurrentDateString() {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth()+1 < 9 ? "0"+(now.getMonth()+1) : now.getMonth()+1;
	const day = now.getDate() < 9 ? "0"+(now.getDate()) : now.getDate();
	const dateString = year+"-"+month+"-"+day;
	return dateString;
};

// Set all date inputs on the page to the current date to save user time
function setDateInputsToToday() {
	// Grab any date inputs
	let dateControl = document.querySelectorAll('input[type="date"]');
	// If any were found, set them to today
	if (dateControl) {
		dateControl.forEach( (dateInput) => {
			dateInput.value = getCurrentDateString();
		});
	}
	// Otherwise ignore
	else {
		return;
	}
};

window.onload = () => {
	// Set date selectors to default to today.
	setDateInputsToToday();

	let data = null;
	let timeScale = 'week';

	// Grab the reptile ID to request data for
	try {
		// Encase the graph request in a try to limit its execution to just the cage page
		let reptile_id = document.getElementById('temperatureChart').getAttribute('data-id');

		if (reptile_id) {
			// Get enclosure data from the server and plot it on the graphs
			data = getData(reptile_id);
		}
	}
	catch(e) {
		if (e instanceof TypeError) {
			return;
		}
	}
}

function panLeft(data, slice) {
	let thing = data.slice(...slice);
	parseTemp(thing);
	parseHumid(thing);

}



function getData(reptile_id) {
	// Send a get request for the reptile's chart data
	let request = new XMLHttpRequest();
	let chartData = null;
	request.open('GET', 'graph/'+reptile_id, true);
	request.responseType = "json";
	request.onreadystatechange = () => {
		if (request.readyState == 4 && request.status == 200) {
			// Obtain the raw data from the response and pass it to the parser, then to the plotter
			chartData = request.response;
			//let tempPoints = parseTemp(chartData);
			//let humidPoints = parseHumid(chartData);
			//plotTempData(tempPoints);
			//plotHumidData(humidPoints);
			plot(chartData);
		}
	}
	request.send("");

	return chartData;
}

function plot(data) {
	let all = contiguDates(data);
	plotTemps(all.dates, all.cools, all.warms);
	plotHumids(all.dates, all.humids);
}

function plotTemps(dates, cools, warms) {
	let canvas = document.getElementById('temperatureChart');
	if (canvas) {
		canvas = canvas.getContext('2d');
		let chart = new Chart(canvas, {
			type: 'line',
			data: {
				labels: dates,
				datasets: [coolset(cools), warmset(warms)]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: false
						}
					}]
				}
			}
		})

		chart.update();
	}
}

function plotHumids(dates, humids) {
	let canvas = document.getElementById('humidityChart');
	if (canvas) {
		canvas = canvas.getContext('2d');
		let chart = new Chart(canvas, {
			type: 'line',
			data: {
				labels: dates,
				datasets: [humidset(humids)]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: false
						}
					}]
				}
			}
		})

		chart.update();
	}
}

function coolset(cools) {
	const coolSet = {
		label: "Cool Temperatures",
		data: cools,
		//backgroundColor: ['#001F3F'],
		borderColor: ['#001F3F'],
		borderWidth: 2
	};
	return coolSet;
}
// Create a dataset for the warm readings
function warmset(warms) {
	const warmSet = {
		label: "Warm Temperatures",
		data: warms,
		//backgroundColor: ['#FF0000'],
		borderColor: ['#FF0000'],
		borderWidth: 2
	}
	return warmSet;
}
// Create datasets for the humidity readings
function humidset(humids) {
	const humiSet = {
		label: "Humidity",
		data: humids,
		//backgroundColor: ['#EEEEEE'],
		borderColor: ['#7FDBFF'],
		borderWidth: 2
	}
	return humiSet;
}

// Split the data into separate arrays to be fed to the graphs
// lol this is slow as fuck.
function contiguDates(data) {
	// Start empty arrays for each reading item
	let sets = {
		dates: [],
		cools: [],
		warms: [],
		humids: []
	}
	const dayLabel = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sun"];
	let firstDate;
	let lastDate;
	// Add the first dataset's date/reading to their respective arrays
	if (data) {
		firstDate = new Date(data[0].date.replace(/-/g, '\/').replace(/T.+/, ''));
		console.log("first date is ", firstDate);
		// Add the first data set to the collection
		sets.dates.push(firstDate.toTimeString());
		sets.cools.push(data[0].coldest);
		sets.warms.push(data[0].warmest);
		sets.humids.push(data[0].humidity);
	}
	if (data.length > 1) {
		lastDate = new Date(data[data.length-1].date.replace(/-/g, '\/').replace(/T.+/, ''));
		console.log("last date: ", lastDate);
		let currentIndex = 1;
		let dayIncr = 1;
		// Instantiate nextDay as a date earlier than useful
		let nextDay = new Date(0);
		console.log("nextDay1: ", nextDay)
		// Loop through the days until they
		while (lastDate.getTime() - nextDay.getTime() > 0) {
			let newDate = new Date(data[currentIndex].date.replace(/-/g, '\/').replace(/T.+/, ''));

			// find the next date in the line by incrementing from the first day
			nextDay = new Date(firstDate);
			nextDay.setDate(nextDay.getDate() + dayIncr);
			console.log("nextDay2: ", nextDay)

			const date1 = {
				year: newDate.getFullYear(),
				month: newDate.getMonth(),
				day: newDate.getDate()
			}
			const date2 = {
				year: nextDay.getFullYear(),
				month: nextDay.getMonth(),
				day: nextDay.getDate()
			}

			// If the next date in the data is not contiguous, make one and insert it with empty warm/cool/humid values
			if (date1.year !== date2.year && date1.month !== date2.month && date1.day !== date2.day) {
				sets.dates.push(nextDay.toTimeString());
				sets.cools.push(null);
				sets.warms.push(null);
				sets.humids.push(null);
				dayIncr += 1;
			}
			// If the next date in the data did follow the previous, insert it and the reading data
			else {
				sets.dates.push(nextDay.toTimeString());
				sets.cools.push(data[currentIndex].coldest);
				sets.warms.push(data[currentIndex].warmest);
				sets.humids.push(data[currentIndex].humidity);
				dayIncr += 1;
				// increment the index only if data was pulled
				if (currentIndex < data.length - 1) {
					currentIndex += 1 ;
				}
				else break;
			}
		}
	}
	return sets;
}





// take a date from the DB response and format it to look 'american'
function dateLabel(date) {
	let thisDate = new Date(date.replace(/-/g, '\/').replace(/T.+/, ''));
	let dateLabel = (thisDate.getMonth()+1).toString() + "-"
		+ thisDate.getDate().toString() + "-"
		+ thisDate.getFullYear().toString().substring(2);
	return dateLabel;
}



// Return the dates and temperature data in an object
function parseTemp(cageData) {
	let dateLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sun"];
	let coolData = [null, null, null, null, null, null, null];
	let warmData = [null, null, null, null, null, null, null];
	// Loop through the data and put it into arrays
	for (let i = 0; i < cageData.length; i++) {
		let thisDate = new Date(cageData[i].date.replace(/-/g, '\/').replace(/T.+/, ''));
		var thisDay = thisDate.getDay();
		coolData[thisDay] = cageData[i].coldest;
		warmData[thisDay] = cageData[i].warmest;
	}
	/*
	cageData.forEach( (datum) => {
		// Push the date, cool temp, and warm temp into their arrays
		//dateLabels.push(dateLabel(datum.date));

		coolData.push(datum.coldest);
		warmData.push(datum.warmest);
	});
*/
	return {
		dates: dateLabels,
		cools: coolData,
		warms: warmData
	};
}

// Return the dates and humidity data in an object
function parseHumid(cageData) {
	let dateLabels = [];
	let humiData = [];
	cageData.forEach( (datum) => {
		// Push the date and humidity into their arrays
		dateLabels.push(dateLabel(datum.date));
		humiData.push(datum.humidity);
	})

	return {
		dates: dateLabels,
		humis: humiData
	};
}





function plotTempData(tempData) {
	let canvas = document.getElementById('temperatureChart');
	if (canvas) {
		canvas = canvas.getContext('2d');
		let chart = new Chart(canvas, {
			type: 'line',
			data: {
				labels: tempData.dates,
				datasets: [cooldataset(tempData), warmdataset(tempData)]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: false
						}
					}]
				}
			}
		})

		chart.update();
	}
}

function plotHumidData(humidData) {
	let canvas = document.getElementById('humidityChart');
	if (canvas) {
		canvas = canvas.getContext('2d');
		let chart = new Chart(canvas, {
			type: 'line',
			data: {
				labels: humidData.dates,
				datasets: [humiddataset(humidData)]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true,
							max: 100
						}
					}]
				}
			}
		})

		chart.update();
	}

}

// Create a dataset for the cold readings
function cooldataset(data) {
	const coolSet = {
		label: "Cool Temperatures",
		data: data.cools,
		//backgroundColor: ['#001F3F'],
		borderColor: ['#001F3F'],
		borderWidth: 2
	};
	return coolSet;
}
// Create a dataset for the warm readings
function warmdataset(data) {
	const warmSet = {
		label: "Warm Temperatures",
		data: data.warms,
		//backgroundColor: ['#FF0000'],
		borderColor: ['#FF0000'],
		borderWidth: 2
	}
	return warmSet;
}
// Create datasets for the humidity readings
function humiddataset(data) {
	const humiSet = {
		label: "Humidity",
		data: data.humis,
		//backgroundColor: ['#EEEEEE'],
		borderColor: ['#7FDBFF'],
		borderWidth: 2
	}
	return humiSet;
}
