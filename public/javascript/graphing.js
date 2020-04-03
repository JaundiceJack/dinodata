
/* --- Button interaction functions --- */
// Upon clicking the next button, cycle to the next 7 days/month to display
function incrementTime() {
	let data = retreiveLocalData();
	if (data && data.timeScale === 'week') {
		// Only increment if the starting day index is less than the total days
		if (data.startDay < data.dates.length-1) {
			data.startDay += 7;
			sessionStorage.setItem('startDay', data.startDay.toString());
		}
		// Plot the week obtained from weekSet()
		let weekset = weekSet(data, data.startDay);
		if (weekset) plot(weekset);
	}
	if (data && data.timeScale === 'month') {
		return;
	}
}
// Upon clicking the next button, cycle to the previous 7 days/month to display
function decrementTime() {
	let data = retreiveLocalData();
	if (data && data.timeScale === 'week') {
		// Only decrement if the starting day index over 0
		if (data.startDay > 0) {
			data.startDay -= 7;
			sessionStorage.setItem('startDay', data.startDay.toString());
		}
		// Plot the week obtained from weekSet()
		let weekset = weekSet(data, data.startDay);
		if (weekset) plot(weekset);
	}
	if (data && data.timeScale === 'month') {
		return;
	}
}


/* --- Dataset acquisition --- */
// Get the data stored in sessionStorage or re-request it
function retreiveLocalData() {
	let data;
	if (typeof(Storage) !== "undefined") {
		data = {
			dates: JSON.parse(sessionStorage.getItem('dates')),
			cools: JSON.parse(sessionStorage.getItem('cools')),
			warms: JSON.parse(sessionStorage.getItem('warms')),
			humids: JSON.parse(sessionStorage.getItem('humids')),
			startDay: parseInt(sessionStorage.getItem('startDay')),
			timeScale: sessionStorage.getItem('timeScale')
		}
	}
	else {
		//TODO: if sessionStorage is disabled, re-request the dataset
		data = null;
	}
	
	return data;
}
// Request the data from the server
function getData() {
	try {
		// Encase the graph request in a try to limit its execution to just the cage page
		let reptile_id = document.getElementById('temperatureChart').getAttribute('data-id');
		if (reptile_id) {
			// Get enclosure data from the server and plot it on the graphs
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
					plot(weekSet(data, 0));

					// Store the data in the session to scroll through graph data
					if (typeof(Storage) !== "undefined") {
						sessionStorage.setItem('dates', JSON.stringify(data.dates));
						sessionStorage.setItem('cools', JSON.stringify(data.cools));
						sessionStorage.setItem('warms', JSON.stringify(data.warms));
						sessionStorage.setItem('humids', JSON.stringify(data.humids));
						sessionStorage.setItem('startDay', '0');
						sessionStorage.setItem('timeScale', 'week');
					}
					else {
						console.log("no storage found");
					}
				}
			}
			request.send("");
			// Return the obtained data to scroll through with buttons
			return data;
		}
	}
	catch(e) {
		// if the graph element was not found, do nothing
		if (e instanceof TypeError) {
			return;
		}
		else {
			console.log(e);
		}
	}
}


/* --- Dataset manipulation --- */
// Return an empty set of contiguous dates and reading slots
function emptySet(firstDate, lastDate) {
	const daysBetween = (lastDate.getTime() - firstDate.getTime())/(1000 * 3600 * 24) + 1;
	let sets = {
		dates: [],
		cools: [],
		warms: [],
		humids: []
	}
	// Add blanks to the sets for each day
	for (let i = 0; i < daysBetween; i++) {
		// make a day based on the first one and increment it by i-days
		let nextDay = new Date(firstDate);
		nextDay.setDate(nextDay.getDate() + i);
		// put the date in the set and null for the readings
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
		// Obtain an empty data set with contiguous dates
		let sets = emptySet(firstDate, lastDate);
		let index = 0;
		// loop over the empty set, assigning data in their sequential spots
		for (let i = 0; i < sets.dates.length; i++) {
			// Check that the current empty set's date matches the one in the served data
			if (sets.dates[i].getFullYear() === data[index].date.getFullYear() &&
				sets.dates[i].getMonth() === data[index].date.getMonth() &&
				sets.dates[i].getDate() === data[index].date.getDate()) {
				// Assign the readings at the current index and increment the index to assign the next datum
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
// Obtain a subset of the data spanning a week from the start date index
function weekSet(data, start) {
	// if the start is incremented past the data length, return nothing
	if (start > data.dates.length-1) return;
	// start a subset of the data to fill
	let subset = {
		dates: [],
		cools: [],
		warms: [],
		humids: []
	};
	// loop over the data from the starting index and add each datum to the subset
	for (let i = start; i < data.dates.length; i++) {
		subset.dates.push(data.dates[i]);
		subset.cools.push(data.cools[i]);
		subset.warms.push(data.warms[i]);
		subset.humids.push(data.humids[i]);
		// end the loop once the day turns to sunday or there's no more data
		if (new Date(data.dates[i]).getDay() === 6) {
			break;
		}
	}

	// If starting from the begining of the data and the first day was not sunday
	if (start === 0 && subset.length < 7) {
		console.log("Filling first days...");
		// Fill in the missing days to return a full week
		let firstDate = subset.dates[0];
		let firstDay = firstDate.getDay();
		for (let i = 0; i <= firstDay; i++) {
			let prevDay = new Date(firstDate);
			prevDay.setDate(prevDay.getDate() - i);
			subset.dates.shift(prevDay);
			subset.cools.shift(null);
			subset.warms.shift(null);
			subset.humids.shift(null);
		}
	}
	// if the subset is at the end of the data and less than a week, fill it out
	else if (subset.length < 7) {
		console.log("Filling last days...");
		// get the last day and add days to it until sunday
		let lastDate = subset.dates[subset.dates.length - 1];
		let lastDay = lastDate.getDay();
		let daysToAdd = 7 - lastDay;
		for (let i = 0; i < daysToAdd; i++) {
			let nextDay = new Date(lastDate);
			nextDay.setDate(nextDay.getDate + i);
			subset.dates.push(nextDay);
			subset.cools.push(null);
			subset.warms.push(null);
			subset.humids.push(null);
		}
	}


	return subset;
}
// Convert the dates that are returned from the server to graph-usable ones
function convertDates(data) {
	let copy = data;
	for(let i = 0; i < copy.length; i++) {
		copy[i].date = new Date(copy[i].date.replace(/-/g, '\/').replace(/T.+/, ''));
	}
	return copy;
}


/* --- Graphing functions --- */
// Plot the given data for the temperature and humidity graphs
function plot(data) {
	plotTemps(data.dates, data.cools, data.warms);
	plotHumids(data.dates, data.humids);
}
// Plot the cool and warm datapoints on the temperature graph
function plotTemps(dates, cools, warms) {
	let canvas = document.getElementById('temperatureChart');
	if (canvas) {
		// Check for previous chart instances and delete them
		if (window.tempChart) {
			window.tempChart.destroy();
		}
		// Create a new chart instance on the canvas
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
		// Store the curent chart in the window to delete later
		window.tempChart = chart;
		// Update the current chart with the new values
		chart.update();
	}
}
// Plot the humidity datapoints on the humidity graph
function plotHumids(dates, humids) {
	let canvas = document.getElementById('humidityChart');
	if (canvas) {
		// Check for previous chart instances and delete them
		if (window.humidChart) {
			window.humidChart.destroy();
		}
		// Create a new chart instance on the canvas
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
		// Store the curent chart in the window to delete later
		window.humidChart = chart;
		// Update the current chart with the new values
		chart.update();
	}
}
// Format the graph date label set to MM-DD-YY
function dateset(dates) {
	let labels = [];
	for (let i = 0; i < dates.length; i++) {
		let current = new Date(dates[i]);
		let dateLabel =
			(current.getMonth()+1).toString() + "-"
			+ current.getDate().toString() + "-"
			+ current.getFullYear().toString().substring(2);
		labels.push(dateLabel);
	}
	return labels;
}
// Package the cool readings into a graphable dataset
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
// Package the warm readings into a graphable dataset
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
// Package the humidity readings into a graphable dataset
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

export default {getData, decrementTime, incrementTime};