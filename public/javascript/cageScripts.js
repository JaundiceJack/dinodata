/*
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
*/


/*
function loadTemperatureChart() {
	// Grab the canvas
	let canvas = document.getElementById('temperatureChart').getContext('2d');
	// Set the reptile to look for
	let reptile_id = canvas.reptile_id;
	// Grab the data


	// Grab the data with an AJAX request
	
	let readingDates = [];
	let coolDate = [];
	let warmData = [];
	canvas.onload = (reptile_id) => {
		$.ajax({
			type: 'GET',
			url: '/monitoring/cage/temperatures/'+reptile_id,
			success: (res) => {

			},
			error: (err) => {

			}
		})
	}

};
*/
/*
function loadHumidityChart() {
	// Grab the canvas
	let canvas = document.getElementById('humidityChart').getContext('2d');
	// Make the chart
	let humidChart = new Chart(canvas, {
		type: 'line',
		data: {
			labels: readingDates,
			datasets: [{
				label: "Humidity",
				data: humidData,
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
	});
};
*/
//function loadGrowthChart() {
//
//};
/*
window.onload = () => {
	console.log("wtf");
	// Load Charts
	function loadTemperatureChart() {
		// Grab the canvas
		let canvas = document.getElementById('temperatureChart').getContext('2d');
		// Set the reptile to look for
		let reptile_id = canvas.reptile_id;
		console.log(reptile_id);
		console.log("is id blank?");
		loadData('/monitoring/cage/temperatures/', reptile_id, (tempData) => {
			console.log(tempData);
		})	
	};
	loadTemperatureChart();
	loadHumidityChart();
	//loadGrowthChart();
};
*/
