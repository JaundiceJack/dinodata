const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in the reptile model
const Reptile = require('../models/reptile');
// Bring in the reading model
const Reading = require('../models/reading');

// Handle get requests to the cage page with an ID
router.get('/cage/:reptile_id', ensureAuthenticated, async (req, res) => {
	// Grab the user's reptiles from the DB
	let reptiles = await Reptile.find({owner_id: req.user._id}).exec();
	// If none are found, ask them to create one
	if(!reptiles) { createRedir(req, res); }
	// Otherwise, find the reptile by ID and render the page
	else {
		for (let i = 0; i < reptiles.length; i++) {
			if (reptiles[i]._id.toString() === req.params.reptile_id) {
				cageRender(req, res, reptiles, i);
				return;
			}

		}
		// If the requested ID did not appear in the list, alert user and direct to the first
		req.flash('danger', "Requested reptile not found!");
		cageRender(req, res, reptiles, 0);
	}
})
// Handle get requests to the cage page with no ID supplied
router.get('/cage', ensureAuthenticated, async (req, res) => {
	// Grab the user's reptiles from the DB
	let reptiles = await Reptile.find({owner_id: req.user._id}).exec();
	// If none are found, ask them to create one
	if(!reptiles) { createRedir(req, res); }
	// Otherwise, render the page with the first reptile in the list
	else { cageRender(req, res, reptiles, 0); }
})


// Redirect the user to the reptile creation page
function createRedir(req, res) {
	req.flash('danger', "Please create a reptile.");
	res.redirect('/monitoring/create_reptile');
}

// Render the cage page for the reptile at index
function cageRender(req, res, reptiles, index) {
	// Pass the errors into the page and clear them for the next request
	let errors = req.session.errors;
	req.session.errors = null;
	// Render the page with the selected reptile
	res.render('cagePage', {selected: reptiles[index], reptiles: reptiles, routePath: '/cage/',  errors: errors});
}

// Capitalize first letter (for reptile name mostly)
function capitalize(name) {
	let str = name.split(" ");
	for (let i = 0; i < str.length; i++){
		str[i] = str[i][0].toUpperCase() + str[i].substr(1); }
	return str.join(" ");
};


// Cage Graph Data Requests
router.get('/cage/temp/:reptile_id', ensureAuthenticated, (req, res) => {
	Reading.find({reptile_id: req.params.reptile_id}).sort('date').exec( (err, readings) => {
		if (err) console.log(err);
		res.json(readings);
	});
});
router.get('/cage/humi/:reptile_id', ensureAuthenticated, (req, res) => {
	Reading.find({reptile_id: req.params.reptile_id}).sort('date').exec( (err, readings) => {
		if (err) console.log(err);
		res.json(readings);
	});
});

// Cage Data Post Route
router.post('/cage/:reptile_id', ensureAuthenticated, async (req, res) => {
	// Grab entered enclosure readings and the reptile ID
	const data = {date: req.body.date,
				  time: req.body.time,
				  warm: req.body.warmSide,
				  cold: req.body.coolSide,
				  humidity: req.body.humidity,
				  reptile_id: req.params.reptile_id};

	// Validate Entries
	req.checkBody('date', "Please enter a valid date. Or else.").isISO8601();
	req.checkBody('time', "Please select a time.").notEmpty();
	req.checkBody('coolSide', "Please enter the cool side's temperature.").notEmpty();
	req.checkBody('coolSide', "Please use numbers for the cool temperature.").isFloat();
	req.checkBody('warmSide', "Please enter the warm side's temperature.").notEmpty();
	req.checkBody('warmSide', "Please use numbers for the warm temperature.").isFloat();
	req.checkBody('humidity', "Please enter the humidity.").notEmpty();
	req.checkBody('humidity', "Please use numbers for the humidity percentage.").isFloat();

	// Get entry errors
	let errors = req.validationErrors();

	// Grab the reptile from the DB
	let reptile = await Reptile.findOne({_id: data.reptile_id, owner_id: req.user._id}).exec();

	// Attempt to create a reading
	createReading(req, res, reptile, data, errors);
});


function createReading(req, res, reptile, data, errors) {
	// If a reptile was not found, inform the user and go back
	if (!reptile) {
		req.flash("The reptile you're attempting to update was not found.");
		res.redirect(req.header('Referer'));
	}
	// If there were data entry errors, inform the user and go back
	else if (errors) {
		req.session.errors = errors;
		res.redirect('/monitoring/cage/'+reptile._id);
	}
	// If all good, Generate a new reading for the reptile
	else {
		let newReading = new Reading({reptile_id: reptile._id,
									  date: data.date,
									  time: data.time,
									  warmest: data.warm,
									  coldest: data.cold,
									  humidity: data.humidity});
		// Save the reading, inform of failure or success
		newReading.save( (err) => {
			if (err) {
				console.log(err);
				req.flash('Errors encountered while saving entries...');
				res.redirect('/monitoring/cage/'+reptile._id);
				return;
 			}
			else {
				req.flash('success', "Reading for "+capitalize(reptile.name)+" added.");
				res.redirect('/monitoring/cage/'+reptile._id);
			}
		})
	}
};

// Reptile Creation Page Route
router.get('/create_reptile', (req, res) => {
	res.render('newReptilePage', {
		errors: req.session.errors
	})
	req.session.errors = null;
});
// Reptile Creation Post Route
router.post('/create_reptile', (req, res) => {
	// Grab the entered info for a new reptile
	const name = req.body.reptiname.toLowerCase().trim();
	const type = req.body.reptitype;

	// Validate entries
	req.checkBody('reptiname', 'Give the new reptile a name.').notEmpty();
	req.checkBody('reptiname', 'Please only use letters for their name.').isAlpha();
	// TODO: Check that type is in the list of approved types

	// Check for input errors
	let errors = req.validationErrors();
	if (errors) {
		req.session.errors = errors;
		res.redirect('/monitoring/create_reptile');
	}
	else {
		let newReptile = new Reptile({
			owner_id: req.user._id,
			name: name,
			type: type
		});
		newReptile.save( (err) => {
			if (err) {
				console.log(err);
				req.flash('Errors encountered while saving the new reptile...');
				res.redirect('/monitoring/create_reptile');
				return;
			}
			else {
				req.flash('success', capitalize(newReptile.name)+" successfully added.");
				res.redirect('/monitoring/info/'+newReptile.name);
			}
		});
	};
});

// Prevent users from accessing the monitoring pages until they've logged in
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
