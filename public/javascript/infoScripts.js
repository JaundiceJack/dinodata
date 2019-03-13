

window.onload = () => {
  let colors = [
    {
      name: 'black',
      hex: '#000'
    },
    {
      name: 'white',
      hex: '#FFF'
    }
  ];

  // generate morph color options
  let colorForm = document.getElementById('colorForm');
  // Colorform, the clown's chloroform. The more you know.

  for (let color = 0; color < colors.length; color++) {
    let label = document.createElement("label");
    label.value = colors[color];
    label.innerHTML = colors[color].name;
    console.log(colors[color].name);
    label.class = "fancyText colorLabel";
    let cBox = document.createElement("input");
    cBox.type = "checkbox";
    cBox.class = "colorCBox w-25";
    cBox.style.background = colors[color].hex;

    colorForm.appendChild(label);
    colorForm.appendChild(cBox);

  };

  console.log("page loaded");
}
