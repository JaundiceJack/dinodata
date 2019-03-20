const express = require('express');
const router = express.Router();
const path = require('path');

// Set the location to serve static files (css/js)
router.use(express.static(path.join(__dirname, '../public')));

// Handle a request for the info page
router.get('/info', (req,res) => {
	res.render('infoPage', {});
})

// Handle a request for the cage page
router.get('/cage', (req,res) => {
	res.render('cagePage', {});
})

// Handle a request for the food page
router.get('/food', (req,res) => {
	res.render('foodPage', {});
})

module.exports = router;
