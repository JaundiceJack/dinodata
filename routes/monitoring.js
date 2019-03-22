const express = require('express');
const router = express.Router();
const path = require('path');

// Set the location to serve static files (css/js)
router.use(express.static(path.join(__dirname, '../public')));

// Beginning of get/post handling
// Handle a request for the info page
router.get('/info', (req,res) => {
	res.render('infoPage', {
		nameOfSelected: "Jormun"
	})
	req.flash('success', "Hello Internet");
})

// Handle a request for the cage page
router.get('/cage', (req,res) => {
	res.render('cagePage', {
		nameOfSelected: "Jormun"
	});
})

// Handle a request for the food page
router.get('/food', (req,res) => {
	res.render('foodPage', {
		nameOfSelected: "Jormun"
	});
})

module.exports = router;
