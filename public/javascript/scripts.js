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

// Take an ID and create a chart on the element
function createChart(canvasID) {
	let canvas = document.getElementById(canvasID);
	if (canvas) {
		canvas = canvas.getContext('2d');
		let chart = new Chart(canvas, {
			type: 'line',
			data: {
				labels: [],
				datasets: []
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
		return chart;
	}
	else {
		return null;
	}
}

// Return the dates and temperature data in an object
function tempDataPoints(chartData) {
	let dateLabels = [];
	let coolData = [];
	let warmData = [];
	// Loop through the data and put it into arrays
	chartData.forEach( (datum) => {
		// Format the date to 'month-day-year'
		let thisDate = new Date(datum.date.replace(/-/g, '\/').replace(/T.+/, ''));
		let dateLabel = (thisDate.getMonth()+1).toString() + "-"
		+ thisDate.getDate().toString() + "-"
		+ thisDate.getFullYear().toString().substring(2);
		// Push the date, cool temp, and warm temp into their arrays
		dateLabels.push(dateLabel);
		coolData.push(datum.coldest);
		warmData.push(datum.warmest);
	});

	return {
		dates: dateLabels,
		cools: coolData,
		warms: warmData
	};
}

// Return the dates and humidity data in an object
function humiDataPoints(chartData) {
	let dateLabels = [];
	let humiData = [];
	chartData.forEach( (datum) => {
		let thisDate = new Date(datum.date.replace(/-/g, '\/').replace(/T.+/, ''));
		// Format the date to 'month-day-year'
		let dateLabel = (thisDate.getMonth()+1).toString() + "-"
		+ thisDate.getDate().toString() + "-"
		+ thisDate.getFullYear().toString().substring(2);
		// Push the date and humidity into their arrays
		dateLabels.push(dateLabel);
		humiData.push(datum.humidity);
	})

	return {
		dates: dateLabels,
		humis: humiData
	};
}

// Plot temperatures and update the chart
function plotTempChart(chart, labelObject) {
	// Create datasets for the cold and warm readings
	const coolSet = {
		label: "Cool Temperatures",
		data: labelObject.cools,
		//backgroundColor: ['#001F3F'],
		borderColor: ['#001F3F'],
		borderWidth: 2
	};
	const warmSet = {
		label: "Warm Temperatures",
		data: labelObject.warms,
		//backgroundColor: ['#FF0000'],
		borderColor: ['#FF0000'],
		borderWidth: 2
	}
	// Assign the date labels and readings to the chart
	chart.data.labels = labelObject.dates;
	chart.data.datasets.push(coolSet);
	chart.data.datasets.push(warmSet);
	chart.update();
}

// Plot the humidity and update the chart
function plotHumiChart(chart, labelObject) {
	// Create datasets for the humidity readings
	const humiSet = {
		label: "Humidity",
		data: labelObject.humis,
		//backgroundColor: ['#EEEEEE'],
		borderColor: ['#7FDBFF'],
		borderWidth: 2
	}
	// Assign the date labels and readings to the chart
	chart.data.labels = labelObject.dates;
	chart.data.datasets.push(humiSet);
	//chart.options.scales.yAxes.ticks.beginAtZero = true;
	chart.update();
}

// Request data from the url and plot it on the given canvas
function loadChart(url, canvasID, parser, plotter) {
	// Grab the chart to plot
	let chart = createChart(canvasID);
	if (chart !== null) {
		// Grab the reptile ID to request data for
		let reptile_id = document.getElementById(canvasID).getAttribute('data-id');
		// Send a get request for the reptile's chart data
		let request = new XMLHttpRequest();
		request.open('GET', url+reptile_id, true);
		request.responseType = "json";
		request.onreadystatechange = () => {
			if (request.readyState == 4 && request.status == 200) {
				// Obtain the raw data from the response and pass it to the parser, then to the plotter
				let chartData = request.response
				plotter(chart, parser(chartData));
			}
		}
		request.send("");
	}
}

window.onload = () => {
	// Set date selectors to default to today.
	setDateInputsToToday();



	// Load charts
	loadChart('temp/', 'temperatureChart', tempDataPoints, plotTempChart);
	loadChart('humi/', 'humidityChart', humiDataPoints, plotHumiChart);
}
