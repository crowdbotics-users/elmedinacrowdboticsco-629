var express = require('express');
var router = express.Router();
var path = require('path');
var VIEWS_DIR = path.resolve(__dirname, '../client/public/views');

module.exports = function(app) {
	// API Routes
	app.use('/api/user', require(path.resolve(__dirname, './api/v1/user.js')));

	/* GET home page. */
	app.route('/*')
		.get(function (req, res) {
		  res.sendFile(path.join(VIEWS_DIR, '/index.html'));
		});
};
