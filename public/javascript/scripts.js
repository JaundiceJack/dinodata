// Set all date inputs on the page to the current date
function setDateInputsToToday() {
	// Grab any date inputs
	let dateControl = document.querySelector('input[type="date"]');
	// If any were found, set them to today
	if (dateControl != null) {
		now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth()+1 < 9 ? "0"+(now.getMonth()+1) : now.getMonth()+1;
		const day = now.getDay() < 9 ? "0"+(now.getDay()) : now.getDay();
		const dateString = year+"-"+month+"-"+day;
		dateControl.value = dateString;
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

function tempDataPoints(chartData) {
	let dateLabels = [];
	let coolData = [];
	let warmData = [];
	for (let i = 0; i < chartData.length; i++) {
		dateLabels.push(chartData[i].date)
		coolData.push(chartData[i].cool);
		warmData.push(chartData[i].warm);
	}
	return (dateLabels, coolData, warmData);
}

function humiDataPoints(chartData) {
	let dateLabels = [];
	let humiData = [];
	for (let i = 0; i < chartData.length; i++) {
		dateLabels.push(chartData[i].date)
		humiData.push(chartData[i].humidity);
	}
	return (dateLabels, humiData);
}

function plotTempChart(chart, dates, cools, warms) {
	const coolSet = {
		label: "Cool Temperatures",
		data: cools,
		backgroundColor: ['#EEEEEE'],
		borderColor: ['#444444'],
		borderWidth: 2
	};
	const warmSet = {
		label: "Warm Temperatures",
		data: warms,
		backgroundColor: ['#EEEEEE'],
		borderColor: ['#444444'],
		borderWidth: 2
	}

	chart.data.labels.push(dateLabels);
	chart.data.datasets.push(coolSet);
	chart.data.datasets.push(warmData);
	chart.update();
}

function plotHumiChart(chart, dates, humis) {
	const humiSet = {
		label: "Humidity",
		data: humis,
		backgroundColor: ['#EEEEEE'],
		borderColor: ['#444444'],
		borderWidth: 2		
	}

	chart.data.labels.push(dateLabels);
	chart.data.datasets.push(humiSet);
	chart.update();
}


function loadChart(url, canvasID, parser, plotter) {
	// Grab the chart to plot
	let chart = createChart(canvasID);
	if (chart !== null) {
		//grab the reptile ID to request data for
		let reptile_id = document.getElementById(canvasID).getAttribute('data-id');
		let request = new XMLHttpRequest();
		request.open('GET', url+reptile_id, true);
		request.onreadystatechange = () => {
			if (this.readyState == 4 && this.status == 200) {
				// Once the data is sent, parse and plot the data onto the chart
				const chartData = JSON.parse(this.responseText);
				console.log(chartData);
				console.log('dataempoy');
				plotter(chart, parser(chartData));
			}
		}
		request.send();
	}
}

window.onload = () => {
	// Set date selectors to default to today.
	setDateInputsToToday();

	// Load charts
	loadChart('temp/', 'temperatureChart', tempDataPoints, plotTempChart);
	loadChart('humi/', 'humidityChart', humiDataPoints, plotHumiChart);
}
