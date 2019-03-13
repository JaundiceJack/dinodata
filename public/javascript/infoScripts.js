let colors = [
  { name: 'navy',
    hex: '#001F3F'},
  { name: 'blue',
    hex: '#00F'},
  { name: 'aqua',
    hex: '#7FDBFF'},
  { name: 'teal',
    hex: '#39CCCC'},
  { name: 'olive',
    hex: '#3D9970'},
  { name: 'green',
    hex: '#2ECC40'},
  { name: 'lime',
    hex: '#01FF70 '},
  { name: 'yellow',
    hex: '#FFDC00'},
  { name: 'orange',
    hex: '#FF851B'},
  { name: 'red',
    hex: '#FF4136'},
  { name: 'maroon',
    hex: '#85144b'},  
  { name: 'fuchsia',
    hex: '#F012BE'},
  { name: 'purple',
    hex: '#B10DC9'},
  { name: 'black',
    hex: '#111'},
  { name: 'gray',
    hex: '#AAA'},
  { name: 'silver',
    hex: '#DDD'},  
  { name: 'white',
    hex: '#FFF'}
];


window.onload = () => {
  // generate morph color options
  let colorForm = document.getElementById('colorForm');
  // Colorform, the clown's chloroform. The more you know.

  for (let color = 0; color < colors.length; color++) {
    // Create a label for the current color
    let label = document.createElement("label");
    label.value = colors[color];
    label.className = "cBoxContainer";

    let labelText = document.createElement("p");
    labelText.innerHTML = colors[color].name;
    labelText.className = "cBoxText";
    label.appendChild(labelText);
    
    // Create a checkbox input to put in the label
    let cBox = document.createElement("input");
    cBox.type="checkbox";
    cBox.className = "cBoxInput";
    label.appendChild(cBox);

    // Create a span to hold the option's color
    let cSpan = document.createElement("span");
    cSpan.className = "cBoxBG";
    cSpan.style.backgroundColor = colors[color].hex;
    label.appendChild(cSpan);


    // Place the label and its children inside the form
    colorForm.appendChild(label);
  };

  console.log("page loaded");
}
