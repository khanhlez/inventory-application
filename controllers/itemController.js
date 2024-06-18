const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const Item = require("../models/item");
const Category = require("../models/category");

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
  upload.single("item_image"),
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

    let uploadedImageUrl;
    if (req.file) {
      try {
        const uploadedImage = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((error, result) =>
            error ? reject(error) : resolve(result)
          );
          stream.end(req.file.buffer);
        });
        uploadedImageUrl = uploadedImage.url;
      } catch (err) {
        console.error(err);
        return res.status(500).send("Image upload failed");
      }
    }

    const item = new Item({
      name: req.body.item_name,
      description: req.body.item_description,
      category: req.body.item_category,
      price: req.body.item_price,
      number_in_stock: req.body.item_number_in_stock,
      image: uploadedImageUrl ? uploadedImageUrl : null,
      creation_date: new Date(),
      updated_date: new Date(),
    });

    if (!error.isEmpty()) {
      res.render("layout", {
        body: "forms/itemForm",
        data: { item: {}, categories: categories || [], errors: error.array() },
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
  upload.single("item_image"),
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

    let item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).send("Item not found");
    }

    let uploadedImageUrl;
    if (req.file) {
      try {
        const uploadedImage = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((error, result) =>
            error ? reject(error) : resolve(result)
          );
          stream.end(req.file.buffer);
        });
        uploadedImageUrl = uploadedImage.url;
      } catch (error) {
        console.error("Image upload failed", error);
        // Handle the image upload failure (e.g., render an error page or respond with an error message)
        return res.status(500).send("Image upload failed");
      }
    }

    item.name = req.body.item_name;
    item.description = req.body.item_description;
    item.category = req.body.item_category;
    item.price = req.body.item_price;
    item.number_in_stock = req.body.item_number_in_stock;
    if (uploadedImageUrl) {
      item.image = uploadedImageUrl; // Only update the image URL if a new image was uploaded
    }
    item.updated_date = new Date();

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
multer;

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndDelete(req.params.id);
  res.redirect("/item");
});
