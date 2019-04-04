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

function loadTemperatureChart(canvas, readingDates, coolData, warmData) {
	// Make the chart
	let tempChart = new Chart(canvas, {
		type: 'line',
		data: {
			labels: readingDates,
			datasets: [{
				label: "Cool Temperatures",
				data: coolData,
				backgroundColor: ['#EEEEEE'],
				borderColor: ['#444444'],
				borderWidth: 2
			},
			{
				label: "Warm Temperatures",
				data: warmData,
				backgroundColor: ['#EEEEEE'],
				borderColor: ['#444444'],
				borderWidth: 2
			}]
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
}

function loadHumidityChart(canvas, reptile_id) {
	console.log('loaded humidity chart');
}

function loadGrowthChart(canvas, reptile_id) {
	console.log('loaded growth chart');
}

function loadChart(chartID) {
	let canvas = document.getElementById(chartID);
	let reptile_id = canvas.getAttribute('data-id');
	if (canvas) {
		// Something like this
		requestData(reptile_id, parseXML(response)).parseData(response).chartData(dataLabels);
	}
}

function loadData(url, reptile_id, callback) {
	let request = new XMLHttpRequest();
	request.onreadystatechange = () => {
		if (this.readyState === 4 && this.status === 200) {
			console.log(this.responseText);
			callback(this.responseXML);
		}
	}
	request.open('GET', url+reptile_id, true);
	request.send();
}

function loadCharts() {
	loadChart('temperatureChart');
	loadChart('humidityChart');
	loadChart('growthChart');
}


window.onload = () => {
	// Set date selectors to default to today.
	setDateInputsToToday();
	// Load charts
	loadCharts();
}