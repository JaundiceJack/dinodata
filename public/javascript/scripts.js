window.onload = () => {

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

	function loadTemperatureChart() {
		// Check for data first
		//if (typeof coolData !== 'undefined' &&  typeof warmData !== 'undefined') {
		console.log('bleh');
		// Grab the canvas
		let canvas = document.getElementById('temperatureChart').getContext('2d');
		// Make the chart
		let tempChart = new Chart(canvas, {
			type: 'line',
			data: {
				labels: canvas.readingDates,
				datasets: [{
					label: "Cool Temperatures",
					data: canvas.coolData,
					backgroundColor: ['#EEEEEE'],
					borderColor: ['#444444'],
					borderWidth: 2
				},
				{
					label: "Warm Temperatures",
					data: canvas.warmData,
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
	};

	function loadHumidityChart() {
		// Check for data first
		if ("humidityData" in window) {
			// Grab the canvas
			let canvas = document.getElementById('humidityChart').getContext('2d');
			// Make the chart
			let humidChart = new Chart(canvas, {
				type: 'line',
				data: {
					labels: readingDates, //Pass readingDates array in via node
					datasets: [{
						label: "Humidity",
						data: humidData,
						backgroundColor: ['#EEEEEE'],
						borderColor: ['#444444'],
						borderWidth: 2
					}] //Pass humidData arrays via node
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
		else {
			return;
		}
	};

	function loadGrowthChart() {

	};


	// Set date selectors to default to today.
	setDateInputsToToday();

	// Load Charts
	loadTemperatureChart();
	loadHumidityChart();
	loadGrowthChart();
};

