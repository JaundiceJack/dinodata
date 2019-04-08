const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in the reptile model
const Reptile = require('../models/reptile');
// Bring in the reading model
const Reading = require('../models/reading');


function grabPage(req, res, page, route, reptilesFound) {
	console.log("Grabbing page...");
	if (req.params && req.params.reptile_name) {
		console.log("URL parameter found...");
		for (let i = 0; i < reptilesFound.length; i++ ) {
			if (reptilesFound[i].name === req.params.reptile_name) {
				console.log("Reptile found, rendering page...");
				res.render(page, {
					selected: reptilesFound[i],
					reptiles: reptilesFound,
					routePath: route
				});
			}
		}
	}
	else {
		console.log("URL parameter not found, directing to first reptile...");
		res.redirect('/monitoring/cage/'+reptilesFound[0].name);
	};
};

const openPage = (page, route) => {
	console.log("Opening page...");
	return (req, res) => {
		console.log("boop");
		Reptile.find({owner_id: req.user._id}, (err, reptilesFound) => {
			if (err) console.log(err);
			if (reptilesFound) {
				console.log("Reptiles found in DB");
				grabPage(req, res, page, route, reptilesFound);
			}
			else {
				console.log("Reptiles not found in DB");
				req.flash('danger', "Please create a reptile.");
				res.redirect('/monitoring/create_reptile');
			}
		})
	}
};



router.get('/info/:reptile_name', ensureAuthenticated, openPage('infoPage', '/info/'));
router.get('/cage/:reptile_name', ensureAuthenticated, openPage('cagePage', '/cage/'));
router.get('/food/:reptile_name', ensureAuthenticated, openPage('foodPage', '/food/'));

router.get('/info', ensureAuthenticated, openPage('infoPage', '/info/'));
router.get('/cage', ensureAuthenticated, openPage('cagePage', '/cage/'));
router.get('/food', ensureAuthenticated, openPage('foodPage', '/food/'));

// Cage Page Post Request
router.post('/cage', ensureAuthenticated, (req, res) => {
	// Grab entered enclosure readings
	const date = req.body.date;
	const warmSide = req.body.warmSide;
	const coolSide = req.body.coolSide;
	const humidity = req.body.humidity;
	console.log('page data grabbed');
	// Validate Entries
	req.checkBody('coolSide', "Please enter the cool side's temperature.").notEmpty();
	req.checkBody('warmSide', "Please enter the warm side's temperature.").notEmpty();
	req.checkBody('humidity', "Please enter the humidity.").notEmpty();
	req.checkBody('date', "Please enter a valid date. Or else.").isISO8601();
	console.log('data validated');
	let errors = req.validationErrors();
	if (errors) {
		//!! TODO rendering the page like this will leave reptiles empty. redirect with errors
		console.log('errors were found in entered data');
		res.render('cagePage', {
			errors: errors })}
	else {

		//TODO Ill need to issue a query to the DB for the reptile by name,
		//....OOORRR I could set the data-id of an element on the page to grab here
		const currentID = req.body.reptile_id['data-id'];
		let newReading = new Reading({
			reptile_id: currentID,
			date: date,
			warm: warmSide,
			cool: coolSide,
			humidity: humidity })
		console.log('new reading was created, saving...');
		// Save the reptile to mongo
		newReading.save( (err) => {
			if (err) {
				console.log('errors encountered while saving');
				console.log(err);
				return; }
			else {
				console.log('reading successfully saved, rerouting...');
				req.flash('success', "Reading added.");
				res.redirect('/monitoring/cage/'+currentID); }})}}
);

// Create Reptile Get Request
router.get('/create_reptile', (req, res) => {
	res.render('newReptilePage', {})}
);

// Capitalize first letter (for reptile name after successful addition)
function capitalize(name) {
	let str = name.split(" ");
	for (let i = 0; i < str.length; i++){
		str[i] = str[i][0].toUpperCase() + str[i].substr(1); }
	return str.join(" ");
}

// Create Reptile Post Request
router.post('/create_reptile', (req, res) => {
	// Grab the entered info for a new reptile
	const name = req.body.reptiname.toLowerCase().trim();
	const type = req.body.reptitype;
	// Validate entries
	req.checkBody('reptiname', 'Give the new reptile a name.').notEmpty();
	// Check for input errors
	let errors = req.validationErrors();
	// If errors were found, rerender the page and display error messages
	if (errors){
		res.render('newReptilePage', {
			errors: errors })}
	// Create a new reptile if no errors were found
	else{
		let newReptile = new Reptile({
			owner_id: req.user._id,
			name: name,
			type: type })
		// Save the reptile to mongo
		newReptile.save( (err) => {
			if (err) {
				console.log(err);
				return; }
			// Update the placeholder list with the new reptile and redirect
			else {
				req.flash('success', capitalize(newReptile.name)+" successfully added.");
				res.redirect('/monitoring/info/'+newReptile.name); }})}}
);



// Prevent users from accessing the info pages until they've logged in
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next(); }
	else{
		req.flash('danger', "Please log in to view reptile information.");
		res.redirect('/profile/login'); }
}



module.exports = router;
