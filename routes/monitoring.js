const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in the reptile model
const Reptile = require('../models/reptile');

// Beginning of get/post handling
// Handle a request for the info page
router.get('/info', ensureAuthenticated, (req,res) => {
	Reptile.find({owner_id: req.user._id}, (err, reptiles) => {
		res.locals.reptiles = reptiles;
		res.render('infoPage', {
			nameOfSelected: "Jormun"
		});
	});
});

// Handle a request for the cage page
router.get('/cage', ensureAuthenticated, (req,res) => {
	Reptile.find({owner_id: req.user._id}, (err, reptiles) => {
		res.locals.reptiles = reptiles;
		res.render('cagePage', {
			nameOfSelected: "Jormun"
		});
	});
});

// Handle a request for the food page
router.get('/food', ensureAuthenticated, (req,res) => {
	Reptile.find({owner_id: req.user._id}, (err, reptiles) => {
		res.locals.reptiles = reptiles;
		res.render('foodPage', {
			nameOfSelected: "Jormun"
		});
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
				res.redirect('/monitoring/info')
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
