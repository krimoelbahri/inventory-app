const Category = require("../models/category");
const Item = require("../models/item");
const { body, validationResult, check } = require("express-validator");
var async = require("async");
require("dotenv").config();

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
exports.create_category_get = function (req, res) {
	res.render("category-create", { title: "Add a category" });
};
//create category POST req
exports.create_category_post = [
	body("name")
		.trim()
		.isLength({ min: 3 })
		.withMessage("Category name must at least have 3 characters ")
		.bail()
		.isAlpha("en-US", { ignore: " -" })
		.withMessage("Category name must have alphabitical values only "),
	body("name").custom(async (value) => {
		const category = await Category.find({ name: value });
		if (category.length != 0) {
			return Promise.reject("Category already Exists");
		}
	}),
	function (req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.render("category-create", { title: "Add a category", errors: errors.errors });
		} else {
			new Category({ name: req.body.name }).save((err) => {
				if (err) {
					return next(err);
				}
				res.redirect("/");
			});
		}
	},
];
//delete a category GET req
exports.delete_category_get = function (req, res, next) {
	Item.find({ category: req.params.id }).exec(function (err, result) {
		if (err) {
			return next(err);
		}
		res.render("category-delete", {
			title: "delete a category",
			items: result,
		});
	});
};
//delete a category POST req
exports.delete_category_post = [
	body("admin").custom((value) => {
		if (value !== process.env.ADMIN_PASSWORD) {
			console.log(value);
			console.log(process.env.ADMIN_PASSWORD);
			return Promise.reject("Wrong Admin password");
		}
		return true;
	}),
	function (req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			Item.find({ category: req.params.id }).exec(function (err, result) {
				if (err) {
					return next(err);
				}
				res.render("category-delete", {
					title: "delete a category",
					items: result,
					errors: errors.errors,
				});
			});
		} else {
			Category.findByIdAndDelete(req.params.id, {}, (err) => {
				if (err) {
					return next(err);
				}
				res.redirect("/");
			});
		}
	},
];
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
	Category.find()
		.sort([["name", "ascending"]])
		.exec(function (err, result) {
			if (err) {
				return next(err);
			}
			if (result.length === 0) {
				res.render("category-create", {
					title: "Add a category",
					errors: ["No category found plz create a category"],
				});
			}
			res.render("item-create", { title: "Add an item", categories: result });
		});
};
//create item POST req
exports.create_item_post = [
	body("name")
		.trim()
		.isLength({ max: 35 })
		.withMessage("Item name is too long")
		.bail()
		.isAlpha("en-US", { ignore: " -" })
		.withMessage("Item name must have alphabitical values only "),
	body("description")
		.trim()
		.isLength({ min: 20 })
		.withMessage("description is too Short, Min 20 char")
		.bail()
		.isAlphanumeric("en-US", { ignore: " -,.;\r?\n" })
		.withMessage("only alphanumeric values accepted in description"),
	body("price", "Max price is $9999").isFloat({ max: 9999 }),
	body("stock", "Max stock is 200 pieces").isFloat({ max: 200 }),
	function (req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			Category.find()
				.sort([["name", "ascending"]])
				.exec(function (err, result) {
					if (err) {
						return next(err);
					}
					if (result.length === 0) {
						res.render("category-create", {
							title: "Add a category",
							errors: ["No category found plz create a category"],
						});
					}
					res.render("item-create", {
						title: "Add an item",
						categories: result,
						errors: errors.errors,
					});
				});
		} else {
			new Item({
				name: req.body.name,
				description: req.body.description,
				price: req.body.price,
				stock: req.body.stock,
				category: req.body.category,
			}).save((err) => {
				if (err) {
					return next(err);
				}
				res.redirect("/");
			});
		}
	},
];
//delete an item GET req
exports.delete_item_get = function (req, res, next) {
	Item.findById(req.params.id, {}, {}, (err, result) => {
		if (err) {
			return next(err);
		}
		res.render("item-delete", { title: "delete an item", item: result });
	});
};
//delete an item POST req
exports.delete_item_post = [
	body("admin").custom((value) => {
		if (value !== process.env.ADMIN_PASSWORD) {
			return Promise.reject("Wrong Admin password");
		}
		return true;
	}),
	function (req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			Item.findById(req.params.id, {}, {}, (err, result) => {
				if (err) {
					return next(err);
				}
				res.render("item-delete", {
					title: "delete an item",
					item: result,
					errors: errors.errors,
				});
			});
		} else {
			Item.findByIdAndDelete(req.params.id, {}, (err) => {
				if (err) {
					return next(err);
				}
				res.redirect("/");
			});
		}
	},
];

//update an item GET req
exports.update_item_get = function (req, res, next) {
	async.parallel(
		{
			item: function (callback) {
				Item.findById(req.params.id).populate("category").exec(callback);
			},
			categories: function (callback) {
				Category.find()
					.sort([["name", "ascending"]])
					.exec(callback);
			},
		},
		function (err, result) {
			if (err) {
				return next(err);
			}
			res.render("item-create", {
				title: "update item",
				categories: result.categories,
				item: result.item,
			});
		},
	);
};
//update an item POST req
exports.update_item_post = [
	body("name")
		.trim()
		.isLength({ max: 35 })
		.withMessage("Item name is too long")
		.bail()
		.isAlpha("en-US", { ignore: " -" })
		.withMessage("Item name must have alphabitical values only "),
	body("description")
		.trim()
		.isLength({ min: 20 })
		.withMessage("description is too Short, Min 20 char")
		.bail()
		.isAlphanumeric("en-US", { ignore: " -,.;\r?\n" })
		.withMessage("only alphanumeric values accepted in description"),
	body("price", "Max price is $9999").isFloat({ max: 9999 }),
	body("stock", "Max stock is 200 pieces").isFloat({ max: 200 }),
	body("admin").custom((value) => {
		if (value !== process.env.ADMIN_PASSWORD) {
			return Promise.reject("Wrong Admin password");
		}
		return true;
	}),
	function (req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			async.parallel(
				{
					item: function (callback) {
						Item.findById(req.params.id).populate("category").exec(callback);
					},
					categories: function (callback) {
						Category.find()
							.sort([["name", "ascending"]])
							.exec(callback);
					},
				},
				function (err, result) {
					if (err) {
						return next(err);
					}
					res.render("item-create", {
						title: "update item",
						categories: result.categories,
						item: result.item,
						errors: errors.errors,
					});
				},
			);
		} else {
			let item = new Item({
				_id: req.params.id, //This is required, or a new ID will be assigned!
				name: req.body.name,
				description: req.body.description,
				price: req.body.price,
				stock: req.body.stock,
				category: req.body.category,
			});
			Item.findByIdAndUpdate(req.params.id, item, {}, function (err) {
				if (err) {
					console.log(err);
					return next(err);
				}
				res.redirect("/");
			});
		}
	},
];
