const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');

// Set the location to serve static files (css/js)
router.use(express.static(path.join(__dirname, '../public')));

// Bring in the user model
const User = require('../models/user');

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
	/*
	req.bodyCheck('name', 'A username is required').notEmpty();
	req.bodyCheck('email', 'An email address is required').notEmpty();
	req.bodyCheck('email', 'Email entered is not valid').isEmail();
	req.bodyCheck('password', 'A password is required').notEmpty();
	req.bodyCheck('passwordConfirm', 'Passwords do not match').equals(req.body.password);
	

	// Check for input errors
	let errors = req.validationErrors();
	if (errors){
		res.render('newAccountPage', {
			errors: errors
		})
	}

	// Create a new user if no errors were found
	else{
		let newUser = new User({
			username: username,
			password: password,
			email: email
		});

		// Encrypt the password before saving the user
		bcrypt.getSalt(10, (err, salt) => {
			bcrypt.hash(newUser.password, salt, (err, hash) => {
				if (err) console.log(err)
				else {
					newUser.password = hash;
					// Finally save the user if they did everything right
					newUser.save((err) => { if (err) console.log(err);})
				}
			});
		});
	}
	*/

})

module.exports = router;
