function selectReptile(reptileID) {
	// Remove the selection style from all options
	let reptiles = document.getElementsByClassName('reptiOption');
	for(let i = 0; i < reptiles.length; i++){
		reptiles[i].classList.remove('selectedReptile');
	}
	// Add the selection style to the clicked object
	document.getElementById(reptileID).classList.add('selectedReptile');
	// Set the selected ID to the clicked reptile's
	selected = reptileID;
	// Log the ID
	console.log(selected);
};