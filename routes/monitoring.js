const express = require('express');
const router = express.Router();

// Beginning of get/post handling
// Handle a request for the info page
router.get('/info', (req,res) => {
	req.flash('success', "Hello Internet");
	res.render('infoPage', {
		nameOfSelected: "Jormun"
	})
	
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
