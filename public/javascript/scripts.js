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
	let currentWeek = 0;
	let currentMonth = 0;

	// Grab the reptile ID to request data for
	try {
		// Encase the graph request in a try to limit its execution to just the cage page
		let reptile_id = document.getElementById('temperatureChart').getAttribute('data-id');

		if (reptile_id) {
			// Get enclosure data from the server and plot it on the graphs
			data = getData(reptile_id);
		}

		let prevButton = document.getElementById("tempLeft");
		let nextButton = document.getElementById("tempRight");
		prevButton.onclick = panWeek(data, toWeek);
	}
	catch(e) {
		if (e instanceof TypeError) {
			return;
		}
	}
}

function getWeekSlice(data, weekNum) {
	let all = fullSet(data);
	let part = (data, weekNum) => {
		let incr = 0;
		let firstWeek = [];
		let restWeeks = [];

		let weekStartIndex = 0;
		let weekEndIndex;
		for (let i = 0; i < data.length; i++) {
			if (data[i].date.getDay() === 0) {
				weekEndIndex = i;
				break;
			}
		}
		// not really sure what Im doing yet
		if (weekNum === 0) {
			return data.subArr(0, weekEndIndex);
		}
		else if (weekNum === 1) {
			return data.subArr(weekEndIndex, weekEndIndex+7);
		}
		else if (weekNum === 2) {
			return data.subArr(weekEndIndex+7, weekEndIndex+14);
		}






		for (let i = 0; i < data.length; i++) {

			firstWeek.push(data[i])
		}




		for (let i = 0; i < data.length; i++) {
			let curDay = data[i].date.getDay();
			if (curDay === 0) {

			}
		}
	}


	let week = all[weekNum]
	plotTemps(all.dates, all.cools, all.warms)
	

}



function getData(reptile_id) {
	// Send a get request for the reptile's chart data
	let request = new XMLHttpRequest();
	let data = null;
	request.open('GET', 'graph/'+reptile_id, true);
	request.responseType = "json";
	request.onreadystatechange = () => {
		if (request.readyState == 4 && request.status == 200) {
			// Obtain the raw data from the response and pass it to the parser, then to the plotter
			let chartData = request.response;
			// Get the dates in a usable format
			chartData = convertDates(chartData);
			// Split the data up into arrays within a set
			data = fullSet(chartData);
			// Give the data to the plotter to put on the graph
			plot(data);
		}
	}
	request.send("");
	// Return the obtained data to scroll through with buttons
	return data;
}

function convertDates(data) {
	let copy = data;
	for(let i = 0; i < copy.length; i++) {
		copy[i].date = new Date(copy[i].date.replace(/-/g, '\/').replace(/T.+/, ''));
	}
	return copy;
}

// Plot the given data for the temperature and humidity graphs
function plot(data) {
	plotTemps(data.dates, data.cools, data.warms);
	plotHumids(data.dates, data.humids);
}

// Return an empty set of contiguous dates and reading slots
function emptySet(firstDate, lastDate) {
	const daysBetween = (lastDate.getTime() - firstDate.getTime())/(1000 * 3600 * 24);
	let sets = {
		dates: [],
		cools: [],
		warms: [],
		humids: []
	}
	// Add blanks to the sets for each day
	for (let i = 0; i < daysBetween; i++) {
		nextDay = new Date(firstDate);
		nextDay.setDate(nextDay.getDate() + i);
		sets.dates.push(nextDay);
		sets.cools.push(null);
		sets.warms.push(null);
		sets.humids.push(null);
	}
	return sets;
}

// Split the data into separate arrays to be fed to the graphs
function fullSet(data) {
	if (data) {
		const firstDate = data[0].date;
		const lastDate = data[data.length-1].date;
		let sets = emptySet(firstDate, lastDate);
		let index = 0;
		for (let i = 0; i < sets.dates.length; i++) {
			if (sets.dates[i].getFullYear() === data[index].date.getFullYear() &&
				sets.dates[i].getMonth() === data[index].date.getMonth() &&
				sets.dates[i].getDate() === data[index].date.getDate()) {
				// Assign the readings at the current date index
				sets.cools[i] = data[index].coldest;
				sets.warms[i] = data[index].warmest;
				sets.humids[i] = data[index].humidity;
				index++;
			}
		}
		return sets;
	}
	// return an empty set if there was no data
	else {
		return {
			dates: [],
			cools: [],
			warms: [],
			humids: []
		}
	}
}

function plotTemps(dates, cools, warms) {
	let canvas = document.getElementById('temperatureChart');
	if (canvas) {
		canvas = canvas.getContext('2d');
		let chart = new Chart(canvas, {
			type: 'line',
			data: {
				labels: dateset(dates),
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
				labels: dateset(dates),
				datasets: [humidset(humids)]
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

// Format the date set to MM-DD-YY
function dateset(dates) {
	let labels = [];
	for (let i = 0; i < dates.length; i++) {
		let dateLabel = 
			(dates[i].getMonth()+1).toString() + "-"
			+ dates[i].getDate().toString() + "-"
			+ dates[i].getFullYear().toString().substring(2);
		labels.push(dateLabel);
	}
	return labels;
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











// take a date from the DB response and format it to look 'american'
function dateLabel(data) {

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
