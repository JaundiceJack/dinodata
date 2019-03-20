const express = require('express');
const router = express.Router();
const path = require('path');

// Set the location to serve static files (css/js)
router.use(express.static(path.join(__dirname, '../public')));

// Handle a request for the account creation page
router.get('/create_account', (req,res) => {
	res.render('newAccountPage', {});
})

module.exports = router;
