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
	// So, should I break the data up into an array of 7length arrays?

	let timeScale = 'week';

	// Grab the reptile ID to request data for
	try {
		// Encase the graph request in a try to limit its execution to just the cage page
		let reptile_id = document.getElementById('temperatureChart').getAttribute('data-id');

		if (reptile_id) {
			// Get enclosure data from the server and plot it on the graphs
			data = getData(reptile_id);
		}

		let weekData = parseDataIntoWeeks(data);








		let tempPanLeft = document.getElementById('templeft');
		tempPanLeft.onclick = () => {
			if (timeScale === 'week') {
				let page = data.slice()
			}
			else if (timeScale === 'month') {

			}
		};
		let tempPanRight = document.getElementById('tempright');
		tempPanRight.onclick = () => {};
		let modTempWeek = document.getElementById('tempweek');
		modTempWeek.onclick = () => {};
		let modTempMonth = document.getElementById('tempmonth');
		modTempWeek.onclick = () => {};

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
			let tempPoints = parseTemp(chartData);
			let humidPoints = parseHumid(chartData);
			plotTempData(tempPoints);
			plotHumidData(humidPoints);
		}
	}
	request.send("");

	return chartData;
}

// Split the data into separate arrays to be fed to the graphs
function contiguDates(data) {
	// Start empty arrays for each reading item
	let contiguArr = []; // dates
	let cools = [];
	let warms = [];
	let humids = [];
	// Start a previous date that will hinge on the current date
	let prevDate;
	// Add the first dataset's date/reading to their respective arrays
	if (data) {
		prevDate = new Date(data[0].date.replace(/-/g, '\/').replace(/T.+/, '')
		contiguArr.push(prevDate);
		cools.push(data[0].coolest);
		warms.push(data[0].warmest);
		humids.push(data[0].humidity);
	}
	// Add more if there is data to add
	if (data.length > 1) {
		for (let i = 1; i < data.length; i++) {
			// set today as the current date in the iteration
			let today = new Date(data[i].date.replace(/-/g, '\/').replace(/T.+/, ''));
			// set tomorrow as the date following the previous in the array
			let tomorrow = new Date(prevDate.getDate() + 1);
			// If the next date in the data is not contiguous, make one and insert it with empty warm/cool/humid values
			if (today !== tomorrow) {
				contiguArr.push(tomorrow);
				cools.push(null);
				warms.push(null);
				humids.push(null);
				prevDate = tomorrow;
				i--; // since it was not the next day, repeat this iteration until it is
			}
			// If the next date in the data did follow the previous, insert it and the reading data
			else {
				contiguArr.push(today);
				cools.push(data[i].coolest);
				warms.push(data[i].warmest);
				humids.push(data[i].humidity);
				prevDate = tomorrow;
			}
		}
	}
	
	return {
		dates: contiguArr,
		cools: cools,
		warms: warms,
		humids: humids
	};

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


// Create a dataset for the cold readings
function coolWeek(startDate) {
	const coolSet = {
		label: "Cool Temperatures",
		data: data.cools,
		//backgroundColor: ['#001F3F'],
		borderColor: ['#001F3F'],
		borderWidth: 2
	};
	return coolSet;
}

function plotTempWeek(coolWeek, warmWeek) {
	let canvas = document.getElementById('temperatureChart');
	if (canvas) {
		canvas = canvas.getContext('2d');
		let chart = new Chart(canvas, {
			type: 'line',
			data: {
				labels: tempData.dates,
				datasets: [coolWeek, warmWeek]
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
