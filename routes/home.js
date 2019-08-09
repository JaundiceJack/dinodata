const express = require('express');
const router = express.Router();

// Handle a GET request for the home page
router.get('/', (req, res) => {
	res.render('index', {});
});

router.get('/colors', (req, res) => {
	res.render('palette', {});
});

module.exports = router;