const express = require("express");
const router = express.Router();

const category_controller = require("../controllers/categoryController");
const item_controller = require("../controllers/itemController");

router.get("/", category_controller.category_list);

router.get("/new", category_controller.category_create_get);

router.post("/new", category_controller.category_create_post);

router.get("/:id", category_controller.category_update_get);

router.post("/:id", category_controller.category_update_post);

router.post("/:id/delete", category_controller.category_delete_post);

module.exports = router;
