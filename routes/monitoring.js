const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in the reptile model
const Reptile = require('../models/reptile');
// Bring in the reading model
const Reading = require('../models/reading');


function monitoringDirect(req, res, user_id, reptile_id, routePath, renderPage) {
	// Grab the list of reptiles
	Reptile.find({owner_id: user_id}, '_id name type', (err, reptiles) => {
		if (err) console.log(err);
		// Grab the focused reptile
		Reptile.findOne({_id: reptile_id}, (err, reptile) => {
			if (err) console.log(err);
			// Grab the focused reptile's readings
			Reading.find({reptile_id: reptile._id}, (err, readings) => {
				if (err) console.log(err);
				res.render(renderPage, {
					readings: readings,
					reptiles: reptiles,
					routePath: routePath
				});
			});
		});
	});
};

function monitoringRedirect(req, res, user_id, routePath) {
	// Find the user's reptiles
	Reptile.find({owner_id: user_id}, (err, reptiles) => {
		// If user has reptiles, redirect to the first's page
		if (reptiles.length > 0) {
			res.redirect('/monitoring'+routePath+reptiles[0]._id);
		}
		// Otherwise, take them to the reptile creation page
		else {
			req.flash('danger', "Please create a reptile.");
			res.redirect('/monitoring/create_reptile');
		}	
	});
}

// Info Page Get Request
router.get('/info/:reptile_id', ensureAuthenticated, (req, res) => {
	// Grab the ID of the selected reptile
	const selectedID = req.params.reptile_id;
	// Direct to the reptile's info page
	monitoringDirect(req, res, req.user._id, selectedID, '/info/', 'infoPage');
})
// Info Page Redirect
router.get('/info', ensureAuthenticated, (req, res) => {
	// Direct to the reptile's info page
	monitoringRedirect(req, res, req.user._id, '/info/');
})

// Cage Page Get Request
router.get('/cage/:reptile_id', ensureAuthenticated, (req, res) => {
	// Grab the ID of the selected reptile
	const selectedID = req.params.reptile_id;
	// Direct to the reptile's cage page
	monitoringDirect(req, res, req.user._id, selectedID, '/cage/', 'cagePage')
});
// Cage Page Redirect
router.get('/cage', ensureAuthenticated, (req,res) => {
	// Direct to the reptile's cage page
	monitoringRedirect(req, res, req.user._id, '/cage/');
});

// food Page Get Request
router.get('/food/:reptile_id', ensureAuthenticated, (req, res) => {
	// Grab the ID of the selected reptile
	const selectedID = req.params.reptile_id;
	// Direct to the reptile's food page
	monitoringDirect(req, res, req.user._id, selectedID, '/food/', 'foodPage')
});
// food Page Redirect
router.get('/food', ensureAuthenticated, (req,res) => {
	// Direct to the reptile's info page
	monitoringRedirect(req, res, req.user._id, '/food/');
});


// Cage Page Post Request
router.post('/cage', ensureAuthenticated, (req, res) => {
	// Grab entered enclosure readings
	const warmSide = req.body.warmSide;
	const coolSide = req.body.coolSide;
	const humidity = req.body.humidity;

	// Validate Entries
	req.checkBody('cooSide', "Please enter the cool side's temperature.").notEmpty();
	req.checkBody('warmSide', "Please enter the warm side's temperature.").notEmpty();
	req.checkBody('humidity', "Please enter the humidity.").notEmpty();

	let errors = req.validationErrors();
	if (errors) {
		res.render('cagePage', {
			errors: errors
		});
	}
	else {
		let newReading = new Reading({
			reptile_id: req.selected,
			warm: warmSide,
			cool: coolSide,
			humidity: humidity
		});
		// Save the reptile to mongo
		newReading.save( (err) => {
			if (err) {
				console.log(err);
				return;
			}
			else {
				res.redirect('/monitoring/cage');
			}
		})
	}
})

// Food Page Get Request
router.get('/food', ensureAuthenticated, (req,res) => {
	// Find the user's reptiles
	Reptile.find({owner_id: req.user._id}, (err, reptiles) => {
		// If user has reptiles, select the first and display
		if (reptiles.length > 0) {
			res.render('foodPage', {
				reptiles: reptiles,
				selected: reptiles[0]._id
			});
		}
		// Otherwise, take them to the reptile creation page
		else {
			req.flash('danger', "Please create a reptile.");
			res.redirect('/monitoring/create_reptile');
		}
		
	});
});

// Create Reptile Get Request
router.get('/create_reptile', (req, res) => {
	res.render('newReptilePage', {

	});
});

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
			else {
				req.flash('success', newReptile.name+" successfully added.");
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
