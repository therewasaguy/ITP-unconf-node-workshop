var express = require('express');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
dotenv.config();

var Food = require('./models/food.js');

var app = express();

// configure our app
app.set('view engine', 'html');
app.set('layout','layout');
app.engine('html', require('hogan-express'));

app.set('views', __dirname + '/views');

// serve static files 
app.use(express.static(__dirname + '/public'));

app.db = mongoose.connect( process.env.MONGOURL );
console.log('connected to db');

// routes
app.get('/test', function(req, res) {
	var templateData = {
		food: {
			name: "banana",
			type: "fruit"
		}
	}
	res.render('test.html', templateData);
});

// /api/add?name=banana&cat=fruit
app.get('/api/add', function(req, res) {
	var name = req.param('name');
	var cat = req.param('cat');

	var food = new Food({
		name: name,
		category: cat
	});

	food.save( function(err, data) {
		if (err) {
			console.log('error saving');
			console.log(err);
			res.send('there was an error saving');
		}
		else {
			console.log('created new food!');
			res.send('success saving');
		}
	});
});

app.get('/api/search', function(req, res) {
	var name = req.param('name');

	Food.find({name: name}, function(err, data) {
		console.log(data);
		var templateData = {
			food: data[0]
		}
		res.render('test.html', templateData);
	});
});

app.get('/api/cat', function(req, res) {
	var cat = req.param('cat');

	Food.find({category: cat}, function(err, data) {
		var templateData = {
			foods: data
		}
		res.render('cat.html', templateData);
	});
});

// update: http://stackoverflow.com/questions/14199529/mongoose-find-modify-save
app.get('api/update', function(req, res) {
	var name = req.param('name');

	Food.update({name: name}, function(err, data) {
		// data
	});
});

app.listen(process.env.PORT || 8000);