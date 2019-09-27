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
	chartData.forEach( (datum) => {
		let thisDate = new Date(datum.date.replace(/-/g, '\/').replace(/T.+/, ''));
		// Format the date to 'month-day-year'
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

// Plot the humidity and update the chart
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

// Request data from the url and plot it on the given canvas
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

/* Taken from infoScripts.js, implement later

// Make a function to show or hide the color selection form
function toggle(buttonID, toggleTarget) {
  let theButton = document.getElementById(buttonID);
  let target = document.getElementById(toggleTarget);
  if (target.classList.contains('hidden')) {
    target.classList.remove('hidden');
    theButton.innerHTML = "Hide Colors <i class='fas fa-angle-right turn270' style='margin-left: 5px'></i>";
    window.scrollTo(0,document.body.scrollHeight);
  }
  else {
    target.classList.add('hidden');
    theButton.innerHTML = "Show Colors <i class='fas fa-angle-right turn90' style='margin-left: 5px'></i>";
  }
}

// Define a list of color objects for the morph color selections (move to app.js later)
let colors = [
  { name: 'navy',
    hex: '#001F3F',
    selected: false},
  { name: 'blue',
    hex: '#00F',
    selected: false},
  { name: 'aqua',
    hex: '#7FDBFF',
    selected: false},
  { name: 'teal',
    hex: '#39CCCC',
    selected: false},
  { name: 'olive',
    hex: '#3D9970',
    selected: false},
  { name: 'green',
    hex: '#2ECC40',
    selected: false},
  { name: 'lime',
    hex: '#01FF70 ',
    selected: false},
  { name: 'yellow',
    hex: '#FFDC00',
    selected: false},
  { name: 'orange',
    hex: '#FF851B',
    selected: false},
  { name: 'red',
    hex: '#FF0000',
    selected: false},
  { name: 'maroon',
    hex: '#85144b',
    selected: false},
  { name: 'fuchsia',
    hex: '#F012BE',
    selected: false},
  { name: 'purple',
    hex: '#B10DC9',
    selected: false},
  { name: 'brown',
    hex: '#654321',
    selected: false},
  { name: 'black',
    hex: '#111',
    selected: true},
  { name: 'gray',
    hex: '#AAA',
    selected: false},
  { name: 'silver',
    hex: '#DDD',
    selected: false},
  { name: 'white',
    hex: '#FFF',
    selected: true}
];


window.onload = () => {
  // Display Selected colors
  let currentColorsBox = document.getElementById('selectedColors');
  for (let i = 0; i < colors.length; i++) {
    if (colors[i].selected) {
      let selectedColor = document.createElement('div');
      selectedColor.classList.add('cBoxContainer');
      let colorLabel = document.createElement('p');
      colorLabel.classList.add('cBoxText');
      colorLabel.innerHTML = colors[i].name;
      let colorBG = document.createElement('span');
      colorBG.classList.add('cBoxBG');
      colorBG.style.background = colors[i].hex;
      selectedColor.appendChild(colorLabel);
      selectedColor.appendChild(colorBG);
      currentColorsBox.appendChild(selectedColor);
    }
  }


  // TODO: break up into functions, got too lengthy
  // generate morph color options
  let colorForm = document.getElementById('colorForm');
  // Colorform, the clown's chloroform. The more you know.

  for (let color = 0; color < colors.length; color++) {
    // Create a label for the current color
    let label = document.createElement("label");
    label.className = "cBoxContainer";
    label.classList.add('tuchit');

    // Create a checkbox input to put in the label
    let cBox = document.createElement("input");
    cBox.type="checkbox";
    cBox.className = "cBoxInput";
    cBox.value = colors[color];
    cBox.checked = colors[color].selected;
    label.appendChild(cBox);

    // Make text for the lable as a separate element
    let labelText = document.createElement("p");
    labelText.innerHTML = colors[color].name;
    labelText.className = "cBoxText";
    label.appendChild(labelText);

    // Create a span to hold the option's color
    let cSpan = document.createElement("span");
    cSpan.className = "cBoxBG";
    cSpan.style.backgroundColor = colors[color].hex;
    label.appendChild(cSpan);


    // Place the label and its children inside the form
    colorForm.appendChild(label);
  };

  // Make a submit button for the color form
  let sub_butt = document.createElement('input');
  sub_butt.classList.add('colorFormSubmitButton');
  sub_butt.classList.add('buttonTypeA');
  sub_butt.classList.add('smEvenPad');
  sub_butt.classList.add('hoverItem');
  sub_butt.classList.add('clickItem');
  sub_butt.classList.add('h5Size');
  sub_butt.style.margin = '20px 0 0 0';
  sub_butt.type = "submit";
  sub_butt.value = "Update Colors";
  colorForm.appendChild(sub_butt);
}
*/