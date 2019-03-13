// Create the temperature chart
window.onload = () => {
	var tempCanvas = document.getElementById("tempChart").getContext('2d');
	var tempChart = new Chart(tempCanvas, {
			type: 'line',
			data: {
					labels: tempChartLabels,
					datasets: [{
							label: 'Warm Side',
							data: highTempData,
							backgroundColor: '#CBA',
							borderColor: '#EDC',
							borderWidth: 5
					},
					{
						label: 'Cool Side',
						data: lowTempData,
						backgroundColor: '#ABC',
						borderColor: "#CDE",
						borderWidth: 5
						}]
			},
			options: {
				elements: {
					line: {
						tension: 0,
						fill: false
					}
				},
					scales: {
							yAxes: [{
									ticks: {
											suggestedMin: 70,
											suggestedMax: 100
									}
							}]
					}
			}
	});

	// Create the humidity chart
	var humidCanvas = document.getElementById('humidChart').getContext('2d');
	var humidChart = new Chart(humidCanvas, {
		type: 'line',
		data: {
			labels: humidChartLabels,
			datasets: [{
				label: 'Humidity',
				data: humidData,
				backgroundColor: '#ABD',
				borderColor: "#CDF",
				borderWidth: 5
			}]
		},
		options: {
			elements: {
				line: {
					tension: 0,
					fill: false
				}
			},
			scales: {
				yAxes: [{
					ticks: {
						suggestedMin: 40,
						suggestedMax: 90
					}
				}]
			}
		}
	});
}
