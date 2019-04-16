const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in the reptile model
const Reptile = require('../models/reptile');
// Bring in the reading model
const Reading = require('../models/reading');


// Capitalize first letter (for reptile name mostly)
function capitalize(name) {
	let str = name.split(" ");
	for (let i = 0; i < str.length; i++){
		str[i] = str[i][0].toUpperCase() + str[i].substr(1); }
	return str.join(" ");
};

// Render the given reptile's page
function grabPage(req, res, page, route, reptilesFound) {
	if (req.params && req.params.reptile_name) {
		reptilesFound.forEach( (reptile) => {
			if (reptile.name === req.params.reptile_name) {
				res.render(page, {
					selected: reptile,
					reptiles: reptilesFound,
					routePath: route,
					errors: req.session.errors
				});
			}
		});
		req.session.errors = null;
	}
	else {
		console.log("URL parameter not found, directing to first reptile...");
		res.redirect('/monitoring/cage/'+reptilesFound[0].name);
	};
};

// Find the reptile in the DB and open it's page
const openPage = (page, route) => {
	return (req, res) => {
		Reptile.find({owner_id: req.user._id}, (err, reptilesFound) => {
			if (err) console.log(err);
			if (reptilesFound) {
				grabPage(req, res, page, route, reptilesFound);
			}
			else {
				req.flash('danger', "Please create a reptile.");
				res.redirect('/monitoring/create_reptile');
			}
		})
	}
};

// Reptile Specific Monitoring Routes
router.get('/info/:reptile_name', ensureAuthenticated, openPage('infoPage', '/info/'));
router.get('/cage/:reptile_name', ensureAuthenticated, openPage('cagePage', '/cage/'));
router.get('/food/:reptile_name', ensureAuthenticated, openPage('foodPage', '/food/'));

// Non-Specific Monitoring Routes (gets redirected to first reptile)
router.get('/info', ensureAuthenticated, openPage('infoPage', '/info/'));
router.get('/cage', ensureAuthenticated, openPage('cagePage', '/cage/'));
router.get('/food', ensureAuthenticated, openPage('foodPage', '/food/'));

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
router.post('/cage/:reptile_id', ensureAuthenticated, (req, res) => {
	// Grab entered enclosure readings and the reptile ID
	const date = req.body.date;
	const warmSide = req.body.warmSide;
	const coolSide = req.body.coolSide;
	const humidity = req.body.humidity;
	const reptile_id = req.params.reptile_id;

	// Validate Entries
	req.checkBody('date', "Please enter a valid date. Or else.").isISO8601();
	req.checkBody('coolSide', "Please enter the cool side's temperature.").notEmpty();
	req.checkBody('coolSide', "Please use numbers for the cool temperature.").isFloat();
	req.checkBody('warmSide', "Please enter the warm side's temperature.").notEmpty();
	req.checkBody('warmSide', "Please use numbers for the warm temperature.").isFloat();
	req.checkBody('humidity', "Please enter the humidity.").notEmpty();
	req.checkBody('humidity', "Please use numbers for the humidity percentage.").isFloat();
	// Get entry errors
	let errors = req.validationErrors();

	//Grab the reptile to make a reading for
	Reptile.findOne({_id: reptile_id, owner_id: req.user._id, }, (err, reptile) => {
		if (err) console.log(err);
		if (!reptile) {
			req.flash("The reptile you're attempting to update was not found.");
			res.redirect(req.header('Referer'));
		}
		else if (errors) {
			req.session.errors = errors;
			res.redirect('/monitoring/cage/'+reptile.name);
		}
		// Generate a new reading for the reptile
		else {
			let newReading = new Reading({
				reptile_id: reptile._id,
				date: date,
				warm: warmSide,
				cool: coolSide,
				humidity: humidity
			});
			newReading.save( (err) => {
				if (err) {
					console.log(err);
					req.flash('Errors encountered while saving entries...');
					res.redirect('/monitoring/cage/'+reptile.name);
					return;
 				}
				else {
					req.flash('success', "Reading for "+capitalize(reptile.name)+" added.");
					res.redirect('/monitoring/cage/'+reptile.name);
				}
			})
		}
	})
});

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