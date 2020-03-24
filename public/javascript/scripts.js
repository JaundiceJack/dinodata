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

window.onload = () => {
	// Set date selectors to default to today.
	setDateInputsToToday();

	let data = null;
	// So, should I break the data up into an array of 7length arrays?

	let timeScale = 'week';

	// Grab the reptile ID to request data for
	try {
		// Encase the graph request in a try to limit its execution to just the cage page
		let reptile_id = document.getElementById('temperatureChart').getAttribute('data-id');

		if (reptile_id) {
			// Get enclosure data from the server and plot it on the graphs
			data = getData(reptile_id);
		}

		let weekData = parseDataIntoWeeks(data);








		let tempPanLeft = document.getElementById('templeft');
		tempPanLeft.onclick = () => {
			if (timeScale === 'week') {
				let page = data.slice()
			}
			else if (timeScale === 'month') {

			}
		};
		let tempPanRight = document.getElementById('tempright');
		tempPanRight.onclick = () => {};
		let modTempWeek = document.getElementById('tempweek');
		modTempWeek.onclick = () => {};
		let modTempMonth = document.getElementById('tempmonth');
		modTempWeek.onclick = () => {};

	}
	catch(e) {
		if (e instanceof TypeError) {
			return;
		}
	}
}

function panLeft(data, slice) {
	let thing = data.slice(...slice);
	parseTemp(thing);
	parseHumid(thing);

}



function getData(reptile_id) {
	// Send a get request for the reptile's chart data
	let request = new XMLHttpRequest();
	let chartData = null;
	request.open('GET', 'graph/'+reptile_id, true);
	request.responseType = "json";
	request.onreadystatechange = () => {
		if (request.readyState == 4 && request.status == 200) {
			// Obtain the raw data from the response and pass it to the parser, then to the plotter
			chartData = request.response;
			let tempPoints = parseTemp(chartData);
			let humidPoints = parseHumid(chartData);
			plotTempData(tempPoints);
			plotHumidData(humidPoints);
		}
	}
	request.send("");

	return chartData;
}


// So, my idea seed is to create a giant mostly empty object containing year keys
// each year value will be an object 1 for each month
// each month will contain an array of 4 arrays, each with

// when the page loads its supposed to show the latest week
// I'd like to get it to the point that I can give the data
// and the week number, and it will show that week,
//So, instead of dividing up the data into a complicated year/week thing.
// I can get the week number of each datum and assign it to an array in that position
// I'd rather not worry about years, I'd rather take the first date, and the last date,
// I can make it just skip empty weeks too for now,

function getMonthDates(year, month){
	let firstDay = new Date(year, month, 1);
	let lastDay = new Date()
}


//If i get the first date in the data and start the array there, and fill in the dates till the last day in data,
//how would that work?
// so mar 1 - nov 1
// the thing would start with the first date, the readings,
// if the next date in the list is not contiguous, it would make the next one and repeat
// otherwise it would use the data in the next date
// {2020: {jan: {week1: {sun: , mon: , }}}
[
	[
		[
			[null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null],
		],
		[
			[null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null],
		]
	],
		[null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null],
	],
	[
		[null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null],
	]
]
function poop(data) {
	let intoMonths = {};
	for (let i = 0; i < data.length; i++) {
		let date = new Date(data[i].date.replace(/-/g, '\/').replace(/T.+/, ''));
		intoMonths[date.getFullYear()][date.getMonth()].push(data[i]);
	}
	return intoMonths;
}

function getWeek(monthlydata, ) {
	dates
	.getDay()
}

function parseDataIntoWeeks(data) {
	let firstDate = new Date(data[0].date.replace(/-/g, '\/').replace(/T.+/, ''));
	let amalg = {};
	let previousDay = -100;
	for (let i = 0; i < data.length; i++){
		let date = new Date(data[i].date.replace(/-/g, '\/').replace(/T.+/, ''));

		let weekCounter = 0;
		let currentDay = date.getDay();
		// So, when sunday ,current is 6, and prev is 5, then monday, current is 0 and pre is 6
		if(currentDay < previousDay) {
				weekCounter++;
		}
		amalg[date.getFullYear()][date.getUTCMonth()][weekCounter][date.getDay()] = data[i];

		previousDay = currentDay;


		// Wait, so if there's data missing, some could get grouped in the wrong weeks
		// since each day in the week is not looped, or month, it would not be sequential,
		// instead, if I create a date for each day in the month, I can assign  in sequence

	}


	let week = [null, null, null, null, null, null, null];
	let amalg = {year1: {}, year2: {}}

	let year = {
		jan: [],
		feb: [],
		mar: [],
		apr: [],
		may: [],
		jun: [],
		jul: [],
		aug: [],
		sep: [],
		oct: [],
		nov: [],
		dec: []
		}


}



// take a date from the DB response and format it to look 'american'
function dateLabel(date) {
	let thisDate = new Date(date.replace(/-/g, '\/').replace(/T.+/, ''));
	let dateLabel = (thisDate.getMonth()+1).toString() + "-"
		+ thisDate.getDate().toString() + "-"
		+ thisDate.getFullYear().toString().substring(2);
	return dateLabel;
}


// 2 views, weekly and monthly
// 7 slots and monthDayNum slots
// Clicking the buttons should give different snips of cage Data to the functions
// I suppose store the cage data in a return from the acquisition
// and make the buttons call functions that use the data as a param


// Return the dates and temperature data in an object
function parseTemp(cageData) {
	let dateLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sun"];
	let coolData = [null, null, null, null, null, null, null];
	let warmData = [null, null, null, null, null, null, null];
	// Loop through the data and put it into arrays
	for (let i = 0; i < cageData.length; i++) {
		let thisDate = new Date(cageData[i].date.replace(/-/g, '\/').replace(/T.+/, ''));
		var thisDay = thisDate.getDay();
		coolData[thisDay] = cageData[i].coldest;
		warmData[thisDay] = cageData[i].warmest;
	}
	/*
	cageData.forEach( (datum) => {
		// Push the date, cool temp, and warm temp into their arrays
		//dateLabels.push(dateLabel(datum.date));

		coolData.push(datum.coldest);
		warmData.push(datum.warmest);
	});
*/
	return {
		dates: dateLabels,
		cools: coolData,
		warms: warmData
	};
}

// Return the dates and humidity data in an object
function parseHumid(cageData) {
	let dateLabels = [];
	let humiData = [];
	cageData.forEach( (datum) => {
		// Push the date and humidity into their arrays
		dateLabels.push(dateLabel(datum.date));
		humiData.push(datum.humidity);
	})

	return {
		dates: dateLabels,
		humis: humiData
	};
}


// Create a dataset for the cold readings
function coolWeek(startDate) {
	const coolSet = {
		label: "Cool Temperatures",
		data: data.cools,
		//backgroundColor: ['#001F3F'],
		borderColor: ['#001F3F'],
		borderWidth: 2
	};
	return coolSet;
}

function plotTempWeek(coolWeek, warmWeek) {
	let canvas = document.getElementById('temperatureChart');
	if (canvas) {
		canvas = canvas.getContext('2d');
		let chart = new Chart(canvas, {
			type: 'line',
			data: {
				labels: tempData.dates,
				datasets: [coolWeek, warmWeek]
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
		chart.update();
	}
}

function plotTempData(tempData) {
	let canvas = document.getElementById('temperatureChart');
	if (canvas) {
		canvas = canvas.getContext('2d');
		let chart = new Chart(canvas, {
			type: 'line',
			data: {
				labels: tempData.dates,
				datasets: [cooldataset(tempData), warmdataset(tempData)]
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

		chart.update();
	}
}

function plotHumidData(humidData) {
	let canvas = document.getElementById('humidityChart');
	if (canvas) {
		canvas = canvas.getContext('2d');
		let chart = new Chart(canvas, {
			type: 'line',
			data: {
				labels: humidData.dates,
				datasets: [humiddataset(humidData)]
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

		chart.update();
	}

}

// Create a dataset for the cold readings
function cooldataset(data) {
	const coolSet = {
		label: "Cool Temperatures",
		data: data.cools,
		//backgroundColor: ['#001F3F'],
		borderColor: ['#001F3F'],
		borderWidth: 2
	};
	return coolSet;
}
// Create a dataset for the warm readings
function warmdataset(data) {
	const warmSet = {
		label: "Warm Temperatures",
		data: data.warms,
		//backgroundColor: ['#FF0000'],
		borderColor: ['#FF0000'],
		borderWidth: 2
	}
	return warmSet;
}
// Create datasets for the humidity readings
function humiddataset(data) {
	const humiSet = {
		label: "Humidity",
		data: data.humis,
		//backgroundColor: ['#EEEEEE'],
		borderColor: ['#7FDBFF'],
		borderWidth: 2
	}
	return humiSet;
}
