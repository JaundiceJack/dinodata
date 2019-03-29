const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Bring in the user model
const User = require('../models/user');

// Handle a request for the account creation page
router.get('/create_user', (req, res) => {
	res.render('newAccountPage', {

	});
})

// Handle an account creation attempt
router.post('/create_user', (req, res) => {
	// Obtain the entered text
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;

	// Validate input
	req.checkBody('username', 'A username is required').notEmpty();
	req.checkBody('email', 'An email address is required').notEmpty();
	req.checkBody('email', 'Email entered is not valid').isEmail();
	req.checkBody('password', 'A password is required').notEmpty();
	req.checkBody('passwordConfirm', 'Passwords do not match').equals(req.body.password);	

	// Check for input errors
	let errors = req.validationErrors();
	if (errors){
		res.render('newAccountPage', {
			errors: errors
		});
		console.log('errors found.');
	}

	// Create a new user if no errors were found
	else{
		let newUser = new User({
			username: username,
			password: password,
			email: email
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
						req.flash('success', "You've successfully registered for Reptile Lifestyle.");
						res.redirect('../home');
					} 
				});
			});
		});
	}

	// Take user home TODO: and log them in
})

// Request the user profile page
router.get('/:id', (req, res) => {
	// Validate

	// Find
	User.findById(req.params.id, (err, user) => {

		// Display
		res.render('userAccountPage', {
			currentUser: user
		});
	});

})

module.exports = router;
