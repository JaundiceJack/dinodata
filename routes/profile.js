const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in the user model
const User = require('../models/user');
// Bring in the reptile model
const Reptile = require('../models/reptile');

// User Creation Get Request
router.get('/create_user', (req, res) => {
	res.render('newAccountPage', {

	});
});

// User Creation Post Request
router.post('/create_user', (req, res) => {
	// Obtain the entered text
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;
	const metric = req.body.metric;
	const metricBool = metric === 'on' ? true : false;
	const reptiname = req.body.reptiname.toLowerCase().trim();
	const reptitype = req.body.reptitype;

	// Validate input
	req.checkBody('username', 'A username is required').notEmpty();
	req.checkBody('email', 'An email address is required').notEmpty();
	req.checkBody('email', 'Email entered is not valid').isEmail();
	req.checkBody('password', 'A password is required').notEmpty();
	req.checkBody('passwordConfirm', 'Passwords do not match').equals(req.body.password);

	// Check for input errors
	let errors = req.validationErrors();
	// If errors were found, rerender the page and display error messages
	if (errors){
		res.render('newAccountPage', {
			errors: errors
		});
	}
	// Create a new user if no errors were found
	else{
		let newUser = new User({
			username: username,
			password: password,
			email: email,
			useMetric: metricBool
		});
		// Create a new reptile as well
		let newReptile = new Reptile({
			owner_id: newUser._id,
			name: reptiname,
			type: reptitype
		});

		// Encrypt the password before saving the user
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(newUser.password, salt, (err, hash) => {
				if (err) { console.log(err); }
				newUser.password = hash;
				// Finally save the user if they did everything right
				newUser.save((err) => {
					if (err) {
						console.log(err);
						return;
					}
					else {
						// Save the user's reptile
						newReptile.save((err) => {
							if (err) {
								console.log(err);
								return;
							}
							else {
								req.flash('success', "You've successfully registered for Reptile Lifestyle.");
								res.redirect('/profile/login');
							}
						})
					}
				});
			});
		});
	}

	// Take user home TODO: and log them in
});


// Login Get Request
router.get('/login', (req, res) => {
	res.render('loginPage', {

	})
});

// Login Post Request
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/monitoring/cage',
		failureRedirect: '/profile/login',
		failureFlash: true
	})(req, res, next);
});

// Logout Request
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', "You're now logged out.");
	res.redirect('/profile/login');
})

module.exports = router;
