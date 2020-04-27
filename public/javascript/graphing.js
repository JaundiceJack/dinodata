import help from "./helpers.js"

const chartID = "readingChart";

/* --- Button interaction functions to export --- */
// Upon clicking the next button, cycle to the next 7 days/month to display
function incrementTime() {
	// Get the stored data or re-request it
	let dataSet = retreiveLocalData();
	// Incrementing by week
	if (dataSet && dataSet.timeScale === 'week') {
		console.log(dataSet.currentIndex);
		incrementWeek(dataSet)
	}
	if (dataSet && dataSet.timeScale === 'month') {
		incrementMonth(dataSet);
	}
}
// Upon clicking the next button, cycle to the previous 7 days/month to display
function decrementTime() {
	let dataSet = retreiveLocalData();
	if (dataSet && dataSet.timeScale === 'week') {
		console.log(dataSet.currentIndex);
		decrementWeek(dataSet);
	}
	if (dataSet && dataSet.timeScale === 'month') {
		decrementMonth(dataSet);
	}
}
// Clickng the week view shows 7 day increments
function setWeekView() {
	// Get the stored data or re-request it
	let data = retreiveLocalData();
  if (data && data.timeScale === "month") {
		data.timeScale = "week";
		sessionStorage.setItem('timeScale', "week");
		let set = weekSet(data, data.currentIndex);
		if (set) plot(set);
	}
}
// Clicking the month view shows 28-31 day increments
function setMonthView() {
	// Get the stored data or re-request it
	let data = retreiveLocalData();
	if (data && data.timeScale === "week") {
		data.timeScale = "month";
		sessionStorage.setItem('timeScale', "month");
		console.log("time scale changed to ", data.timeScale);
		let set = monthSet(data, data.currentIndex);
		if (set) plot(set);
	}
}

/* --- Cycle through data --- */
//Plot the previous week in the dataset
function decrementWeek(dataSet) {
	// If the current Index is 0, dont do anything
	if (dataSet.currentIndex === 0) return;
	// If there are no indexed sundays, the data does not span a week
	else if (!dataSet.sundayIndices) return;
	// check for sunday indices, if there's none there's no previous week
	else {
		// shorthand the first and last sunday position in the data
		const lastSundayIndex = dataSet.sundayIndices[dataSet.sundayIndices.length - 1];
		const firstSundayIndex = dataSet.sundayIndices[0];
		// check for the position of the current index in the sunday indices
		const currentSundayIndex = dataSet.sundayIndices.indexOf(dataSet.currentIndex);
		// store the new starting position
		let newStart = 0;
		// if the index was found and not the first, go to the previous one
		if (currentSundayIndex > 0 && dataSet.sundayIndices.length > 1) {
			newStart = dataSet.sundayIndices[currentSundayIndex - 1];
		}
		// if not found, and the current is after the last sunday, set it to the last sunday
		else if (currentSundayIndex === -1 && dataSet.currentIndex > lastSundayIndex) {
			newStart = lastSundayIndex;
		}
		// if not found and is before the first sunday, set current to 0
		else if (currentSundayIndex === -1 && dataSet.currentIndex < firstSundayIndex) {
			newStart = 0;
		}
		// Otherwise go to the closest week
		else {
			newStart = findClosestIndex(dataSet.currentIndex, dataSet.sundayIndices);
		}

		// Replot if the index Changed
		if (dataSet.currentIndex !== newStart) {
			sessionStorage.setItem('currentIndex', newStart);
			plot(weekSet(dataSet, newStart));
		}
	}
}
// Plot the next week in the dataset
function incrementWeek(dataSet) {
	// If on the last day do nothing
	if (dataSet.currentIndex === dataSet.dates.length - 1) return;
	// If there are no indexed sundays, the data does not span a week
	else if (!dataSet.sundayIndices) return;
	// If there are sundays, check for the next one and go to it
	else {
		// shorthand the first and last sunday positions in the data
		const lastSundayIndex = dataSet.sundayIndices[dataSet.sundayIndices.length - 1];
		const firstSundayIndex = dataSet.sundayIndices[0];
		// if on the last sunday, do nothing
		if (dataSet.currentIndex === lastSundayIndex) return;
		// look for the current index in the list of sundays
		const currentSundayIndex = dataSet.sundayIndices.indexOf(dataSet.currentIndex);
		// store the new starting position
		let newStart = 0;
		// if found, it will be >= 0. make sure its not the last one and increment
		if (currentSundayIndex >= 0 && currentSundayIndex !== lastSundayIndex) {
			newStart = dataSet.sundayIndices[currentSundayIndex + 1];
		}
		// if not found, and the current is after the last sunday, set it to the last sunday
		else if (currentSundayIndex === -1 && dataSet.currentIndex > lastSundayIndex) {
			newStart = lastSundayIndex;
		}
		// if not found and is before the first sunday, set current to the first sunday
		else if (currentSundayIndex === -1 && dataSet.currentIndex < firstSundayIndex) {
			newStart = firstSundayIndex;
		}
		// Otherwise go to the closest week
		else {
			newStart = findClosestIndex(dataSet.currentIndex, dataSet.sundayIndices);
		}

		// Replot if the index changed
		if (dataSet.currentIndex !== newStart) {
			sessionStorage.setItem('currentIndex', newStart);
			plot(weekSet(dataSet, newStart));
		}
	}
}
// Plot the previous month in the dataset
function decrementMonth(dataSet) {
	if (dataSet.currentIndex === 0) return;
	if (!dataSet.premierIndices) return;
	else {
		// shorthand the first and last premier positions in the data
		const lastPremierIndex = dataSet.premierIndices[dataSet.premierIndices.length - 1];
		const firstPremierIndex = dataSet.premierIndices[0];
		// check for the position of the current index in the premier indices
		const currentPremierIndex = dataSet.premierIndices.indexOf(dataSet.currentIndex);
		// store the new starting position
		let newStart = 0;
		// if the index was found and not the first, go to the previous one
		if (currentPremierIndex > 0 && dataSet.premierIndices.length > 1) {
			newStart = dataSet.premierIndices[currentPremierIndex - 1];
		}
		// if not found, and the current is after the last premier, set it to the last premier
		else if (currentPremierIndex === -1 && dataSet.currentIndex > lastPremierIndex) {
			newStart = lastPremierIndex;
		}
		// if not found and is before the first premier, set current to 0
		else if (currentPremierIndex === -1 && dataSet.currentIndex < firstPremierIndex) {
			newStart = 0;
		}
		// Otherwise go to the closest week
		else {
			newStart = findClosestIndex(dataSet.currentIndex, dataSet.premierIndices);
		}

		// Replot if the index Changed
		if (dataSet.currentIndex !== newStart) {
			sessionStorage.setItem('currentIndex', newStart);
			plot(monthSet(dataSet, newStart))
		}
	}
}
// Plot the next month in the dataset
function incrementMonth(dataSet) {
	// If on the last day do nothing
	if (dataSet.currentIndex === dataSet.dates.length - 1) return;
	// If there are no indexed premiers, the data does not span a week
	else if (!dataSet.premierIndices) return;
	// If there are premiers, check for the next one and go to it
	else {
		// shorthand the first and last premier positions in the data
		const lastPremierIndex = dataSet.premierIndices[dataSet.premierIndices.length - 1];
		const firstPremierIndex = dataSet.premierIndices[0];
		// if on the last premier, do nothing
		if (dataSet.currentIndex === lastPremierIndex) return;
		// look for the current index in the list of premiers
		const currentPremierIndex = dataSet.premierIndices.indexOf(dataSet.currentIndex);
		// store the new starting position
		let newStart = 0;
		// if found, it will be >= 0. make sure its not the last one and increment
		if (currentPremierIndex >= 0 && currentPremierIndex !== lastPremierIndex) {
			newStart = dataSet.premierIndices[currentPremierIndex + 1];
		}
		// if not found, and the current is after the last premier, set it to the last premier
		else if (currentPremierIndex === -1 && dataSet.currentIndex > lastPremierIndex) {
			newStart = lastPremierIndex;
		}
		// if not found and is before the first premier, set current to the first premier
		else if (currentPremierIndex === -1 && dataSet.currentIndex < firstPremierIndex) {
			newStart = firstPremierIndex;
		}
		// Otherwise go to the closest week
		else {
			newStart = findClosestIndex(dataSet.currentIndex, dataSet.premierIndices);
		}

		// Replot if the index changed
		if (dataSet.currentIndex !== newStart) {
			sessionStorage.setItem('currentIndex', newStart);
			plot(monthSet(dataSet, newStart));
		}
	}
}
// take a number and an array of numbers, look through the array for the index of the value closest to the given number
function findClosestIndex(number, array) {
	if (array) {
		let comparison = 0;
		for (let i = 0; i < array.length; i++) {
			if (Math.abs(number - array[i]) < Math.abs(number - comparison)) {
				comparison = i;
			}
		}
		return comparison;
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
			sundayIndices: JSON.parse(sessionStorage.getItem('sundayIndices')),
			premierIndices: JSON.parse(sessionStorage.getItem('premierIndices')),
			currentIndex: parseInt(sessionStorage.getItem('currentIndex')),
			timeScale: sessionStorage.getItem('timeScale')
		}
	}
	else {
		//TODO: if sessionStorage is disabled, re-request the dataset
		data = null;
	}

	return data;
}
// Store changes to the local data
function storeLocalData(dataSet) {
	// Store the data in the session to scroll through graph data
	if (typeof(Storage) !== "undefined") {
		sessionStorage.setItem('dates', JSON.stringify(dataSet.dates));
		sessionStorage.setItem('cools', JSON.stringify(dataSet.cools));
		sessionStorage.setItem('warms', JSON.stringify(dataSet.warms));
		sessionStorage.setItem('humids', JSON.stringify(dataSet.humids));
		sessionStorage.setItem('sundayIndices', JSON.stringify(dataSet.sundayIndices));
		sessionStorage.setItem('premierIndices', JSON.stringify(dataSet.premierIndices));
		sessionStorage.setItem('currentIndex', dataSet.currentIndex.toString());
		sessionStorage.setItem('timeScale', dataSet.timeScale);
	}
	else {
		console.log("no storage found");
	}
}
// Request the data from the server
function getData() {
	try {
		// Encase the graph request in a try to limit its execution to just the cage page
		let reptile_id = document.getElementById(chartID).getAttribute('data-id');
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

					// Make a list of the postions of each sunday found in the dates
					data.sundayIndices = getSundayIndices(data.dates);
					// Do the same for first days of months in the dates
					data.premierIndices = getFirstsOfMonths(data.dates);
					// When clicking through graph data, keep track of the current view
					data.currentIndex = 0;
					// The graph can be viewed by week or month
					data.timeScale = 'week';

					// If weeks of data were found, plot the last week
					if (data.sundayIndices && data.sundayIndices.length > 0) {
						const lastSunday = data.sundayIndices[data.sundayIndices.length - 1];
						data.currentIndex = lastSunday;
						plot(weekSet(data, lastSunday));
					}
					// Otherwise plot the first data point
					else plot(weekSet(data, 0));

					// Store the data in the session to scroll through graph data
					storeLocalData(data);
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
// Obtain a list of the indices where sundays are found in a list of dates
function getSundayIndices(dates) {
	let sundayIndices = [];
	for (let i = 0; i < dates.length; i++) {
		if (dateFns.isSunday(dates[i])) sundayIndices.push(i);
	}
	console.log(sundayIndices);
	return sundayIndices;
}
// Obtain a list of the postions of first days of the month
function getFirstsOfMonths(dates) {
	let premierIndices = [];
	for (let i = 0; i < dates.length; i++) {
		if (dateFns.isFirstDayOfMonth(dates[i])) premierIndices.push(i);
	}
	return premierIndices;
}
// Convert the dates that are returned from the server to graph-usable ones
function convertDates(data) {
	let copy = data;
	for(let i = 0; i < copy.length; i++) {
		copy[i].date = dateFns.parse(copy[i].date);
	}
	return copy;
}

/* --- Dataset manipulation --- */
// Return an empty set of contiguous dates and reading slots
function emptySet(firstDate, lastDate) {
	let emptySet = {
		dates: dateFns.eachDay(	firstDate, lastDate	),
		cools: [],
		warms: [],
		humids: []
	}
	for (let i = 0; i < emptySet.dates.length; i++){
		emptySet.cools.push(null);
		emptySet.warms.push(null);
		emptySet.humids.push(null);
	}
	return emptySet;
}
// Split the data into separate arrays to be fed to the graphs
function fullSet(data) {
	// Return an empty set if there's no data
 	if (!data || data.length === 0) {
		return { dates: [],	cools: [],	warms: [],	humids: [] };
	}
	// If there's only one datapoint, return it in a set
	else if (data.length === 1) {
		return {	dates: [data[0].date],	cools: [data[0].coldest],
			      	warms: [data[0].warmest],	humids: [data[0].humidity]	};
	}
	// Otherwise fill in the missing dates between datapoints
	else {
		// Obtain an empty data set with contiguous dates
		let fullSet = emptySet(data[0].date, data[data.length-1].date);
		// Loop over the empty set, assigning data according to their date
		let index = 0;
		for (let i = 0; i < fullSet.dates.length; i++) {
			// Check that the dates match before assigning the next datum
			if (dateFns.isSameDay(fullSet.dates[i], data[index].date)) {
				// Assign the readings at the current index
				fullSet.cools[i] = data[index].coldest;
				fullSet.warms[i] = data[index].warmest;
				fullSet.humids[i] = data[index].humidity;
				// Increment the index to assign the next datum
				index++;
				if (index > data.length-1) break;
			}
		}
		return fullSet;
	}
}
// Return an empty week set for the given date
function emptyWeekSet(date) {
	const firstOfWeek = dateFns.startOfWeek(date);
	const lastOfWeek = dateFns.endOfWeek(date);
	return {
		dates: dateFns.eachDay(firstOfWeek, lastOfWeek),
		cools: [null, null, null, null, null, null, null],
		warms: [null, null, null, null, null, null, null],
		humids: [null, null, null, null, null, null, null]
	}
}
// Obtain a subset of the data spanning a week from the starting index
function weekSet(data, start) {
	// If the start is incremented past the data length, return nothing
	if (start > data.dates.length-1) return;
	// Start a subset of the data to fill
	let subset = emptyWeekSet(data.dates[start]);
	// Begin a counter at start
	let index = start;
	// Loop over the data and add each datum to the subset
	for (let i = 0; i < 7; i++) {
		// Add data to the subset if the date has a corresponding datapoint
		if (dateFns.isSameDay(subset.dates[i], data.dates[index])) {
			subset.dates[i] = data.dates[index];
			subset.cools[i] = data.cools[index];
			subset.warms[i] = data.warms[index];
			subset.humids[i] = data.humids[index];
			// Increment the data counter and end if it was the last index
			index++;
			if (index > data.dates.length-1) break;
		}
	}
	return subset;
}
// Return an empty dataset spanning a month based on the month of the given date
function emptyMonthSet(date) {
	const firstOfMonth = dateFns.startOfMonth(date);
	const lastOfMonth = dateFns.lastDayOfMonth(date);
	const eachDay = dateFns.eachDay(firstOfMonth, lastOfMonth);
	let emptySet = {
		dates: eachDay,
		cools: [],
		warms: [],
		humids: []
	}
	for (let i = 0; i < eachDay.length; i++) {
		emptySet.cools.push(null);
		emptySet.warms.push(null);
		emptySet.humids.push(null);
	}
	return emptySet;
}
// Obtain a subset of the data spanning a month from the starting index
function monthSet(data, start) {
	// If the start is incremented past the data length, return nothing
	if (start > data.dates.length-1) return;
	// Start a subset of the data to fill
	let subset = emptyMonthSet(data.dates[start]);
	// Begin a counter at start
	let index = start;
	// Loop over the data and add each datum to the subset
	for (let i = 0; i < subset.dates.length; i++) {
		// Add data to the subset if the date has a corresponding datapoint
		if (dateFns.isSameDay(subset.dates[i], data.dates[index])) {
			console.log('setting data...')
			subset.dates[i] = data.dates[index];
			subset.cools[i] = data.cools[index];
			subset.warms[i] = data.warms[index];
			subset.humids[i] = data.humids[index];
			// Increment the data counter and end if it was the last index
			index++;
			if (index > data.dates.length-1) break;
		}
	}
	return subset;
}

/* --- Graphing functions --- */
// Plot the given data for the temperature and humidity graphs
function plot(data) {
	if (data && data.dates.length > 0) {
		plotReadings(data.dates, data.cools, data.warms, data.humids);
	}
}
// Plot the cool, warm, and humidity datapoints on the temperature graph
function plotReadings(dates, cools, warms, humids) {
	let canvas = document.getElementById(chartID);
	if (canvas) {
		// Check for previous chart instances and delete them
		if (window.chart) {
			window.chart.destroy();
		}
		// Create a new chart instance on the canvas
		canvas = canvas.getContext('2d');
		let chart = new Chart(canvas, {
			type: 'line',
			data: {
				labels: dateset(dates),
				datasets: [coolset(cools), warmset(warms), humidset(humids)]
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
		window.chart = chart;
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
