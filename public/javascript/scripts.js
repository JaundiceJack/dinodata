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

function loadData(url, reptile_id, callback) {
	let request = new XMLHttpRequest();
	request.onreadystatechange = () => {
		if (this.readyState === 4 && this.status === 200) {
			const chartData = JSON.parse(this.responseText);
			console.log(chartData);
			callback(chartData);
		}
	}
	request.open('GET', url+reptile_id, true);
	request.send();
}

function loadChart(chartID) {
	let canvas = document.getElementById(chartID);
	if (canvas) {
		let reptile_id = canvas.getAttribute('data-id');
		let url = "/monitoring/";
		url += chartID === 'growthChart' ? "info/" : "cage/";
		loadData(url, reptile_id, () => {
			// TODO I have to parse the data into arrays the chartjs can use
			if (chartID === 'temperatureChart') {
				//load temperatureChart
				return;
			}
			else if (chartID === "humidityChart") {
				// loadHumidityChart
				return;
			}
			else {
				// load growthChart
				return;
			}
		});
	}
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
