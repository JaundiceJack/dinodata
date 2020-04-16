import setToday from "./defaults.js"
import graph from "./graphing.js"

// expose graph button functions
window.decrementTime = graph.decrementTime;
window.incrementTime = graph.incrementTime;
window.setWeekView = graph.setWeekView;
window.setMonthView = graph.setMonthView;

window.onload = () => {
	// Set date selectors to default to today.
	setToday();

	// Load charts if applicable
	graph.getData();
}
