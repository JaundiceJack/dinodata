import help from "./helpers.js"

function setWeekView() {
	// Get the stored data or re-request it
	let data = retreiveLocalData();
  if (data && data.timeScale === "month") {
		data.timeScale = "week";
		sessionStorage.setItem('timeScale', "week");
		let set = weekSet(data, data.startDay);
		if (set) plot(set);
	}
}

function setMonthView() {
	// Get the stored data or re-request it
	let data = retreiveLocalData();
	if (data && data.timeScale === "week") {
		data.timeScale = "month";
		sessionStorage.setItem('timeScale', "month");
		console.log("time scale changed to ", data.timeScale);
		let set = monthSet(data, data.startDay);
		if (set) plot(set);
	}
}

function incrementStart(data) {
	if (data && data.timeScale === "week") {
		// Don't increment if on the last day
		if (data.startDay >= data.dates.length-1) return 0;
		// Increment to the start of the next week if starting from the beginning
		else if (data.startDay === 0) {
			let currentDay = new Date(data.dates[0]);
			return 7 - currentDay.getDay();
		}
		// Don't increment if adding a week would go past the last day
		else if (data.startDay + 7 > data.dates.length-1) return 0;
		// Increment by 7 days otherwise
		else {
			return 7;
		}
	}
	else if (data && data.timeScale === "month") {
		// Don't increment if on the last day
		if (data.startDay >= data.dates.length-1) return 0;
		// Grab the starting index
		let start = data.startDay;
		// If starting at the beginning,

		// Grab the first date for comparison
		let compDate = new Date(data.dates[data.startDay]);
		// Scan through the dates for 5 weeks
		for (let i = 0; i < 5 ; i++) {
			// If incrementing by 7 days would not go past the end,...
			if (start + i * 7 <= data.dates.length-1) {
				// Increment until the first sunday of the next month
				let nextSun = new Date(data.dates[start + i * 7]);
				if (nextSun.getMonth() !== compDate.getMonth()) {
					// And return the number of days traversed
					return i * 7;
				}
			}
			else {
				// Check whether the last date is a different month from the current date
				let lastDate = new Date(data.dates[data.dates.length-1]);
				let startDate = new Date(data.dates[data.startDate]);
				if (lastDate.getMonth() !== firstDate.getMonth()) {
					// If so, return the number of days between the start and last date
					return data.dates.length - 1 - data.startDay;
				}
				// If not, don't increment
				else return 0;
			}

		}
	}
}

function decrementStart(data) {
	if (data && data.timeScale === "week") {
		// Dont decrement if at the beginning
		if (data.startDay === 0) return 0;
		// If decrementing 7 days would put it below 0, return itself
		else if (data.startDay - 7 < 0) {
			return data.startDay;
		}
		// Otherwise decrement by 7 days
		else {
			return 7;
		}
	}
	else if (data && data.timeScale === "month") {

	}
}

// the initial increment of start day must depend on what day that is,
// from there, increments of 7 can be made

/* --- Button interaction functions --- */
// Upon clicking the next button, cycle to the next 7 days/month to display
function incrementTime() {
	// Get the stored data or re-request it
	let data = retreiveLocalData();
	// Incrementing by week
	if (data && data.timeScale === 'week') {
		// Get the number of days to increment and do so if over 0
		let increment = incrementStart(data);
		if (increment > 0) {
			data.startDay += increment;
			// Store the new start index locally if possible (how to store this for server?)
			sessionStorage.setItem('startDay', data.startDay.toString());
			// Plot the new week
			let set = weekSet(data, data.startDay);
			if (set) plot(set);
		}
	}
	if (data && data.timeScale === 'month') {
		let increment = incrementStart(data);
		if (increment > 0) {
			data.startDay += increment;
			// Store the new start index locally if possible (how to store this for server?)
			sessionStorage.setItem('startDay', data.startDay.toString());
			// Plot the new week
			let set = monthSet(data, data.startDay);
			if (set) plot(set);
		}
	}
}
// Upon clicking the next button, cycle to the previous 7 days/month to display
function decrementTime() {
	let data = retreiveLocalData();
	if (data && data.timeScale === 'week') {
		// Get the number of days to go back and do so if over 0
		let decrement = decrementStart(data);
		if (decrement > 0) {
			data.startDay -= decrement;
			sessionStorage.setItem('startDay', data.startDay.toString());
			// Plot the week obtained from weekSet()
			let weekset = weekSet(data, data.startDay);
			console.log("WEEKSET", weekset);
			if (weekset) plot(weekset);
		}

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
					console.log("original: ", data);
					let firstSet = weekSet(data, 0);
					console.log("initial weekSet:", firstSet);
					// Give the data to the plotter to put on the graph
					plot(firstSet);
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
	const first = new Date(firstDate);
	const second = new Date(lastDate);
	const daysBetween = (second.getTime() - first.getTime())/(1000 * 3600 * 24) + 1;
	let sets = {
		dates: [],
		cools: [],
		warms: [],
		humids: []
	}
	// Add blanks to the sets for each day
	for (let i = 0; i < daysBetween; i++) {
		// make a day based on the first one and increment it by i-days
		let nextDay = new Date(first);
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
	// Return an empty set if there's no data
 	if (!data) {
		return {
			dates: [],
			cools: [],
			warms: [],
			humids: []
		}
	}
	// If there's only one datapoint, return it in a set
	else if (data.length === 1) {
		return {
			dates: [data[0].date],
			cools: [data[0].coldest],
			warms: [data[0].warmest],
			humids: [data[0].humidity]
		}
	}
	// Otherwise fill in the missing dates between datapoints
	else {
		// Obtain an empty data set with contiguous dates
		const firstDate = data[0].date;
		const lastDate = data[data.length-1].date;
		let sets = emptySet(firstDate, lastDate);
		// Loop over the empty set, assigning data according to their date
		let index = 0;
		for (let i = 0; i < sets.dates.length; i++) {
			// Check that the dates match before assigning the next datum
			if (help.datesMatch(sets.dates[i], data[index].date)) {
				// Assign the readings at the current index
				console.log("assigning data...");
				sets.cools[i] = data[index].coldest;
				sets.warms[i] = data[index].warmest;
				sets.humids[i] = data[index].humidity;
				// Increment the index to assign the next datum
				index++;
			}
		}
		return sets;
	}
}
// Return an empty week set
function emptyWeekSet(startWeekDate) {
	// Form the date in case it comes in raw
	let start = new Date(startWeekDate);
	// Set up the first date of the week and an empty set
	let firstOfWeek;
	let emptyWeekSet = {
			dates: [],
			cools: [],
			warms: [],
			humids: []
	};
	// If the startDay is not sunday, get the most recent sunday
	if (start.getDay() !== 0) {
		firstOfWeek = new Date(start);
		firstOfWeek.setDate(firstOfWeek.getDate() - start.getDay());
	}
	// Other wise the first date is the one given
	else {
		firstOfWeek = new Date(start);
	}
	// Loop over a week of dates, adding them to the empty set
	for (let i = 0; i < 7; i++) {
		let nextDay = new Date(firstOfWeek);
		nextDay.setDate(nextDay.getDate() + i);
		emptyWeekSet.dates.push(nextDay);
		emptyWeekSet.cools.push(null);
		emptyWeekSet.warms.push(null);
		emptyWeekSet.humids.push(null);
	}
	// Return the set to be filled with data
	return emptyWeekSet;
}

// THOT: since the dates given to weekSet are contiguous, why don't I just take a slice of 7
// It would cut out the need to make an empty week

// Obtain a subset of the data spanning a week from the start date index
function weekSet(data, start) {
	// If the start is incremented past the data length, return nothing
	if (start > data.dates.length-1) return;
	// Start a subset of the data to fill
	let subset = emptyWeekSet(data.dates[start]);
	// Begin a counter at start
	let startInc = start;
	console.log("data given to weekSet", data.cools.slice(start, start+7));
	// Loop over the data and add each datum to the subset
	for (let i = 0; i < 7; i++) {
		// Add data to the subset if the date has a corresponding datapoint
		if (help.datesMatch(subset.dates[i], data.dates[startInc])) {
			console.log('setting data...')
			subset.dates[i] = data.dates[startInc];
			subset.cools[i] = data.cools[startInc];
			subset.warms[i] = data.warms[startInc];
			subset.humids[i] = data.humids[startInc];
			// Increment the data counter and end if it was the last index
			startInc++;
			if (startInc > data.dates.length-1) break;
		}
	}
	return subset;
}
function emptyMonthSet(startDate) {
	// you want a set with all the dates in the given month
	let aDay = new Date(startDate);
	let daysInMonth = new Date(aDay.getFullYear(), aDay.getMonth(), 0).getDate();
	let firstDay = new Date(aDay.getFullYear(), aDay.getMonth(), 1);
  let monthSet = {
		dates: [firstDay], cools: [null], warms: [null], humids: [null]
	}
	for (let i = 1; i < daysInMonth; i++) {
		let nextDay = new Date(firstDay);
		nextDay.setDate(nextDay.getDate() + i);
		monthSet.dates.push(nextDay);
		monthSet.cools.push(null);
		monthSet.warms.push(null);
		monthSet.humids.push(null);
	}
	return monthSet;
}
function monthSet(data, startIndex) {
	// If the start is incremented past the data length, return nothing
	if (startIndex > data.dates.length-1) return;
	// Start a subset of the data to fill
	let subset = emptyMonthSet(data.dates[startIndex]);
	// Begin a counter at start
	let startInc = startIndex;
	// Loop over the data and add each datum to the subset
	for (let i = 0; i < subset.dates.length; i++) {
		// Add data to the subset if the date has a corresponding datapoint
		if (help.datesMatch(subset.dates[i], data.dates[startInc])) {
			console.log('setting data...')
			subset.dates[i] = data.dates[startInc];
			subset.cools[i] = data.cools[startInc];
			subset.warms[i] = data.warms[startInc];
			subset.humids[i] = data.humids[startInc];
			// Increment the data counter and end if it was the last index
			startInc++;
			if (startInc > data.dates.length-1) break;
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

export default {getData, decrementTime, incrementTime, setWeekView, setMonthView};
