var express = require("express");
var router = express.Router();

// Require controller modules.
var inventory_controller = require("../controllers/inventoryController");

/* GET All Inventory */
router.get("/", inventory_controller.index);
/* GET create a Catgory */
router.get("/categories/create", inventory_controller.create_category_get);
/* POST create a Catgory */
router.post("/categories/create", inventory_controller.create_category_post);
/* GET delete a Catgory */
router.get("/categories/:id/delete", inventory_controller.delete_category_get);
/* POST delete a Catgory */
router.post("/categories/:id/delete", inventory_controller.delete_category_post);
/* GET Invenotry Items based on a Catgory */
router.get("/categories/:id", inventory_controller.display_category);

/* GET create an Item */
router.get("/items/create", inventory_controller.create_item_get);
/* POST create an Item */
router.post("/items/create", inventory_controller.create_item_post);
/* GET delete an Item */
router.get("/items/:id/delete", inventory_controller.delete_item_get);
/* POST delete an Item */
router.post("/items/:id/delete", inventory_controller.delete_item_post);
/* GET update an Item */
router.get("/items/:id/update", inventory_controller.update_item_get);
/* POST update an Item */
router.post("/items/:id/update", inventory_controller.update_item_post);
/* GET an Item details*/
router.get("/items/:id", inventory_controller.display_item);

module.exports = router;
