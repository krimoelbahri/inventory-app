#! /usr/bin/env node

console.log(
	"This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true",
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
	console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
	return
}
*/
var async = require("async");
var Category = require("./models/category");
var Item = require("./models/item");

var mongoose = require("mongoose");

var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var categories = [];
var items = [];

function categoryCreate(name, description, cb) {
	categorydetail = { name, description };
	var category = new Category(categorydetail);

	category.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}
		console.log("New Author: " + category);
		categories.push(category);
		cb(null, category);
	});
}

function itemCreate(name, description, price, stock, category, cb) {
	itemdetail = {
		name,
		description,
		price,
		stock,
		category,
	};

	var item = new Item(itemdetail);
	item.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}
		console.log("New Book: " + item);
		items.push(item);
		cb(null, item);
	});
}

function createCategories(cb) {
	async.series(
		[
			function (callback) {
				categoryCreate("Football", "We are selling Football Items", callback);
			},
			function (callback) {
				categoryCreate("Basketball", "We are selling Basketball Items", callback);
			},
			function (callback) {
				categoryCreate("Tennis", "We are selling Tennis Items", callback);
			},
			function (callback) {
				categoryCreate("Handball", "We are selling Handball Items", callback);
			},
			function (callback) {
				categoryCreate("Vollyball", "We are selling Vollyball Items", callback);
			},
			function (callback) {
				categoryCreate("Hocky", "We are selling Hocky Items", callback);
			},
			function (callback) {
				categoryCreate("Baseball", "We are selling Baseball Items", callback);
			},
		],
		// optional callback
		cb,
	);
}

function createItems(cb) {
	async.parallel(
		[
			function (callback) {
				itemCreate("Nike Ball", "Nike Ball", 80, 100, categories[0], callback);
			},
			function (callback) {
				itemCreate("Shirt", "Fc Barcelona Shirt", 110, 20, categories[0], callback);
			},
			function (callback) {
				itemCreate("Ball", "Ball", 50, 200, categories[1], callback);
			},
			function (callback) {
				itemCreate("Jersey", "LA Lakers Shirt", 150, 8, categories[1], callback);
			},
			function (callback) {
				itemCreate("Racket", "Tennis Racket", 350, 20, categories[3], callback);
			},
		],
		// optional callback
		cb,
	);
}

async.series(
	[createCategories, createItems],
	// Optional callback
	function (err, results) {
		if (err) {
			console.log("FINAL ERR: " + err);
		}
		// All done, disconnect from database
		mongoose.connection.close();
	},
);
