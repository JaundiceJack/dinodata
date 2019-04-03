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

function getDateString(date) {
	const year = date.getFullYear();
	const month = date.getMonth()+1 < 9 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
	const day = date.getDay() < 9 ? "0"+(date.getDay()) : date.getDay();

	return year+"-"+month+"-"+day;
}

window.onload = () => {
	// Set date selectors to default to today.
	let dateControl = document.querySelector('input[type="date"]');
	if (dateControl != null) {
		now = new Date();
		dateString = getDateString(now);
		console.log(dateString);
		dateControl.value = dateString;
	}
};

