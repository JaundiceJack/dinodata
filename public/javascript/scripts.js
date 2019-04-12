// Set all date inputs on the page to the current date
function setDateInputsToToday() {
	// Grab any date inputs
	let dateControl = document.querySelector('input[type="date"]');
	// If any were found, set them to today
	if (dateControl != null) {
		const now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth()+1 < 9 ? "0"+(now.getMonth()+1) : now.getMonth()+1;
		const day = now.getDate() < 9 ? "0"+(now.getDate()) : now.getDate();
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
	chartData.forEach( (datum) => {
		let thisDate = new Date(datum.date.replace(/-/g, '\/').replace(/T.+/, ''));
		let dateLabel = (thisDate.getMonth()+1).toString() + "-"
		+ thisDate.getDate().toString() + "-"
		+ thisDate.getFullYear().toString().substring(2);
		dateLabels.push(dateLabel);
		coolData.push(datum.cool);
		warmData.push(datum.warm);
	});

	return {
		dates: dateLabels,
		cools: coolData,
		warms: warmData
	};
}

function humiDataPoints(chartData) {
	let dateLabels = [];
	let humiData = [];
	chartData.forEach( (datum) => {
		let thisDate = new Date(datum.date.replace(/-/g, '\/').replace(/T.+/, ''));
		let dateLabel = (thisDate.getMonth()+1).toString() + "-"
		+ thisDate.getDate().toString() + "-"
		+ thisDate.getFullYear().toString().substring(2);
		dateLabels.push(dateLabel);
		humiData.push(datum.humidity);
	})

	return {
		dates: dateLabels,
		humis: humiData
	};
}

function plotTempChart(chart, labelObject) {
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

	chart.data.labels = labelObject.dates;
	chart.data.datasets.push(coolSet);
	chart.data.datasets.push(warmSet);
	chart.update();
}

function plotHumiChart(chart, labelObject) {
	const humiSet = {
		label: "Humidity",
		data: labelObject.humis,
		//backgroundColor: ['#EEEEEE'],
		borderColor: ['#7FDBFF'],
		borderWidth: 2		
	}

	chart.data.labels = labelObject.dates;
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
		request.responseType = "json";
		request.onreadystatechange = () => {
			if (request.readyState == 4 && request.status == 200) {
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
