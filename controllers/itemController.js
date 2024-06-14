const { body, validationResult } = require("express-validator");
const Item = require("../models/item");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { data } = require("autoprefixer");

exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find({}).sort({ updated_date: -1 }).exec();

  res.render("layout", {
    body: "pages/item",
    data: { items: [...allItems] },
  });
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}, "id name")
    .sort({ name: 1 })
    .exec();
  res.render("layout", {
    body: "forms/itemForm",
    data: { item: {}, categories: categories || [], errors: [] },
  });
});

exports.item_create_post = [
  body("item_name")
    .trim()
    .notEmpty()
    .withMessage("Item name is required")
    .isLength({ min: 3 })
    .withMessage("Item name must be at least 3 characters long")
    .isLength({ max: 30 })
    .withMessage("Item name must be at most 15 characters long")
    .escape(),
  body("item_description")
    .trim()
    .notEmpty()
    .withMessage("Item description is required")
    .isLength({ min: 3 })
    .withMessage("Item description must be at least 3 characters long")
    .isLength({ max: 100 })
    .withMessage("Item description must be at most 15 characters long")
    .escape(),
  body("item_category")
    .trim()
    .notEmpty()
    .withMessage("Item category is required")
    .escape(),
  body("item_price")
    .trim()
    .notEmpty()
    .withMessage("Item price is required")
    .isNumeric()
    .withMessage("Item price must be a number")
    .escape(),
  body("item_number_in_stock")
    .trim()
    .notEmpty()
    .withMessage("Item number in stock is required")
    .isNumeric()
    .withMessage("Item number in stock must be a number")
    .escape(),
  asyncHandler(async (req, res, next) => {
    const error = validationResult(req);
    const categories = await Category.find({}, "id name")
      .sort({ name: 1 })
      .exec();
    const item = new Item({
      name: req.body.item_name,
      description: req.body.item_description,
      category: req.body.item_category,
      price: req.body.item_price,
      number_in_stock: req.body.item_number_in_stock,
      creation_date: new Date(),
      updated_date: new Date(),
    });

    if (!error.isEmpty()) {
      res.render("layout", {
        body: "forms/itemForm",
        data: { item, categories: categories || [], errors: error.array() },
      });
    } else {
      await item.save();
      res.redirect("/item");
    }
  }),
];

exports.item_update_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  const categories = await Category.find({}, "id name")
    .sort({ name: 1 })
    .exec();

  res.render("layout", {
    body: "forms/itemForm",
    data: { item, categories: categories || [], errors: [] },
  });
});

exports.item_update_post = [
  body("item_name")
    .trim()
    .notEmpty()
    .withMessage("Item name is required")
    .isLength({ min: 3 })
    .withMessage("Item name must be at least 3 characters long")
    .isLength({ max: 30 })
    .withMessage("Item name must be at most 15 characters long")
    .escape(),
  body("item_description")
    .trim()
    .notEmpty()
    .withMessage("Item description is required")
    .isLength({ min: 3 })
    .withMessage("Item description must be at least 3 characters long")
    .isLength({ max: 100 })
    .withMessage("Item description must be at most 15 characters long")
    .escape(),
  body("item_category")
    .trim()
    .notEmpty()
    .withMessage("Item category is required")
    .escape(),
  body("item_price")
    .trim()
    .notEmpty()
    .withMessage("Item price is required")
    .isNumeric()
    .withMessage("Item price must be a number")
    .escape(),
  body("item_number_in_stock")
    .trim()
    .notEmpty()
    .withMessage("Item number in stock is required")
    .isNumeric()
    .withMessage("Item number in stock must be a number")
    .escape(),
  asyncHandler(async (req, res, next) => {
    const error = validationResult(req);
    const categories = await Category.find({}, "id name")
      .sort({ name: 1 })
      .exec();
    const item = new Item({
      name: req.body.item_name,
      description: req.body.item_description,
      category: req.body.item_category,
      price: req.body.item_price,
      number_in_stock: req.body.item_number_in_stock,
      creation_date: new Date(),
      updated_date: new Date(),
      _id: req.params.id,
    });

    if (!error.isEmpty()) {
      res.render("layout", {
        body: "forms/itemForm",
        data: { item, categories: categories || [], errors: error.array() },
      });
    } else {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(updatedItem.url);
    }
  }),
];

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndDelete(req.params.id);
  res.redirect("/item");
});
