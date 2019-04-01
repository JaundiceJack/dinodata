const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Beginning of get/post handling
// Handle a request for the info page
router.get('/info', ensureAuthenticated, (req,res) => {
	res.render('infoPage', {
		nameOfSelected: "Jormun"
	})
	
})

// Handle a request for the cage page
router.get('/cage', ensureAuthenticated, (req,res) => {
	res.render('cagePage', {
		nameOfSelected: "Jormun"
	});
})

// Handle a request for the food page
router.get('/food', ensureAuthenticated, (req,res) => {
	res.render('foodPage', {
		nameOfSelected: "Jormun"
	});
})

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
