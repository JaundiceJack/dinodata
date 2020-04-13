function datesMatch(dateOne, dateTwo) {
	let first = new Date(dateOne);
	let second = new Date(dateTwo);
	return ( first.getFullYear() === second.getFullYear() &&
		       first.getMonth() === second.getMonth() &&
		       first.getDate() === second.getDate() );
}

export default {datesMatch};
