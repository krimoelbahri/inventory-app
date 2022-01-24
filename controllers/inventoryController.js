const Category = require("../models/category");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");
var async = require("async");

//inventory Home page **Show all Items/Categories.
exports.index = function (req, res, next) {
	async.parallel(
		{
			categories: function (callback) {
				Category.find()
					.sort([["name", "ascending"]])
					.exec(callback);
			},
			items: function (callback) {
				Item.find()
					.populate("category")
					.sort([["name", "ascending"]])
					.exec(callback);
			},
		},
		function (err, result) {
			if (err) {
				return next(err);
			}
			res.render("index", {
				title: "Elbahri sport store",
				error: err,
				selected_category: { name: "" },
				category_list: result.categories,
				items_list: result.items,
			});
		},
	);
};
//inventory Home page **Show specific Items based on Categories.
exports.display_category = function (req, res, next) {
	async.parallel(
		{
			categories: function (callback) {
				Category.find()
					.sort([["name", "ascending"]])
					.exec(callback);
			},
			category: function (callback) {
				Category.findById(req.params.id).exec(callback);
			},
			items: function (callback) {
				Item.find({ category: req.params.id })
					.populate("category")
					.sort([["name", "ascending"]])
					.exec(callback);
			},
		},
		function (err, result) {
			if (err) {
				return next(err);
			}
			res.render("index", {
				title: "Elbahri sport store",
				selected_category: result.category,
				category_list: result.categories,
				items_list: result.items,
			});
		},
	);
};
//create category GET req
exports.create_category_get = function (req, res, next) {
	res.send("not done yet");
};
//create category POST req
exports.create_category_post = function (req, res, next) {
	res.send("not done yet");
};
//delete a category GET req
exports.delete_category_get = function (req, res, next) {
	res.send("not done yet");
};
//delete a category POST req
exports.delete_category_post = function (req, res, next) {
	res.send("not done yet");
};

//Item page **Show specific Item.
exports.display_item = function (req, res, next) {
	Item.findById(req.params.id)
		.populate("category")
		.exec(function (err, item) {
			if (err) next(err);
			res.render("item", { title: "Elbahri sport store", item: item });
		});
};
//create item GET req
exports.create_item_get = function (req, res, next) {
	res.send("not done yet");
};
//create item POST req
exports.create_item_post = function (req, res, next) {
	res.send("not done yet");
};
//delete an item GET req
exports.delete_item_get = function (req, res, next) {
	res.send("not done yet");
};
//delete an item POST req
exports.delete_item_post = function (req, res, next) {
	res.send("not done yet");
};
//update an item GET req
exports.update_item_get = function (req, res, next) {
	res.send("not done yet");
};
//update an item POST req
exports.update_item_post = function (req, res, next) {
	res.send("not done yet");
};
