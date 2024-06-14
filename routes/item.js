const express = require("express");
const router = express.Router();
const item_controller = require("../controllers/itemController");

router.get("/", item_controller.item_list);

router.get("/new", item_controller.item_create_get);

router.post("/new", item_controller.item_create_post);

router.get("/:id", item_controller.item_update_get);

router.post("/:id", item_controller.item_update_post);

router.post("/:id/delete", item_controller.item_delete_post);

module.exports = router;
