const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in the reptile model
const Reptile = require('../models/reptile');
// Bring in the reading model
const Reading = require('../models/reading');

// Hold the current reptile ID
let currentID = null;
// Hold the basic list of user reptiles (Not yet used, Using will reduce the number of queries I need to get to the next pages)
let userReptiles = [];


// General direct for monitoring routes
const monitoringDirect = (routePath, renderPage) => {
	return (req, res, next) => {
		// Grab the focused reptile
		Reptile.findOne({_id: req.params.reptile_id}, (err, reptile) => {
			if (err) console.log(err);
			currentID = reptile._id;
			res.render(renderPage, {
				reptiles: userReptiles,
				routePath: routePath,
				selected: reptile
			});
		});		
	};
};
// Base page requests are rerouted to reptile-specific pages
const monitoringRedirect = (routePath) => {
	return (req, res, next) => {
		// If a reptile has already been selected, route to its specific page
		if (currentID != null) {
			res.redirect('/monitoring'+routePath+currentID);
		}
		// Otherwise, find the user's first reptile
		else {
			Reptile.find({owner_id: req.user._id}, "_id owner_id name type", (err, reptiles) => {
				// If user has reptiles, set the placeholders and redirect
				if (reptiles.length > 0) {
					currentID = reptiles[0]._id;
					userReptiles = reptiles;
					res.redirect('/monitoring'+routePath+reptiles[0]._id);
				}
				// Otherwise, take them to the reptile creation page
				else {
					req.flash('danger', "Please create a reptile.");
					res.redirect('/monitoring/create_reptile');
				}
			});
		};		
	};
};


// Data Requests
router.get('/cage/temperatures/:reptile_id', ensureAuthenticated, (req, res) => {
	console.log("temperature request received.")
	Reading.find({reptile_id: reptile_id}, (err, readings) => {
		res.send(readings);
	})
})

// Specific Monitoring Page Gets
router.get('/info/:reptile_id',	ensureAuthenticated, monitoringDirect('/info/', 'infoPage'));
router.get('/cage/:reptile_id',	ensureAuthenticated, monitoringDirect('/cage/', 'cagePage'));
router.get('/food/:reptile_id', ensureAuthenticated, monitoringDirect('/food/', 'foodPage'));

// Basic Redirects
router.get('/info', ensureAuthenticated, monitoringRedirect('/info/'));
router.get('/cage', ensureAuthenticated, monitoringRedirect('/cage/'));
router.get('/food', ensureAuthenticated, monitoringRedirect('/food/'));



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
		console.log('errors were found in entered data');
		res.render('cagePage', {
			errors: errors
		});
	}
	else {
		let newReading = new Reading({
			reptile_id: currentID,
			date: date,
			warm: warmSide,
			cool: coolSide,
			humidity: humidity
		});
		console.log('new reading was created, saving...');
		// Save the reptile to mongo
		newReading.save( (err) => {
			if (err) {
				console.log('errors encountered while saving');
				console.log(err);
				return;
			}
			else {
				console.log('reading successfully saved, rerouting...');
				req.flash('success', "Reading added.");
				res.redirect('/monitoring/cage/'+currentID);
			};
		});
	};
});

// Create Reptile Get Request
router.get('/create_reptile', (req, res) => {
	res.render('newReptilePage', {

	});
});

// Capitalize first letter (for reptile name after successful addition)
function capitalize(name) {
	let str = name.split(" ");
	for (let i = 0; i < str.length; i++){
		str[i] = str[i][0].toUpperCase() + str[i].substr(1);
	}
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
			errors: errors
		});
	}
	// Create a new reptile if no errors were found
	else{
		let newReptile = new Reptile({
			owner_id: req.user._id,
			name: name,
			type: type,
		});
		// Save the reptile to mongo
		newReptile.save( (err) => {
			if (err) {
				console.log(err);
				return;
			}
			// Update the placeholder list with the new reptile and redirect
			else {
				userReptiles.push(newReptile);
				req.flash('success', capitalize(newReptile.name)+" successfully added.");
				res.redirect('/monitoring/info');
			}
		})
	}
});



// Prevent users from accessing the info pages until they've logged in
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	else{
		req.flash('danger', "Please log in to view reptile information.");
		res.redirect('/profile/login');
	}
}

module.exports = router;
