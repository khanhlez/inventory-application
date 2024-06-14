const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}).sort({ name: 1 }).exec();

  res.render("layout", {
    body: "pages/category",
    data: { categories: [...allCategories] },
  });
});

exports.category_create_get = (req, res, next) => {
  res.render("layout", {
    body: "forms/categoryForm",
    data: { category: {}, errors: [] },
  });
};

exports.category_create_post = [
  body("category_name", "Category name is required")
    .trim()
    .isLength({ min: 1, max: 20 })
    .escape(),
  body("category_description", "Category description is required")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.category_name,
      description: req.body.category_description,
      image: req.file ? req.file.path : null,
      creation_date: new Date(),
      updated_date: new Date(),
    });

    if (!errors.isEmpty()) {
      res.render("layout", {
        body: "forms/categoryForm",
        data: { errors: errors.array() },
      });
      return;
    }

    await category.save();
    res.redirect("/category");
  }),
];

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  res.render("layout", {
    body: "forms/categoryForm",
    data: { category, errors: [] },
  });
});

exports.category_update_post = [
  // Validate and sanitize the request body
  body("category_name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters long")
    .isLength({ max: 30 })
    .withMessage("Category name must be at most 30 characters long")
    .escape(),

  body("category_description")
    .trim()
    .notEmpty()
    .withMessage("Category description is required")
    .isLength({ min: 5 })
    .withMessage("Category description must be at least 5 characters long")
    .isLength({ max: 100 })
    .withMessage("Category description must be at most 100 characters long")
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.category_name,
      description: req.body.category_description,
      image: req.file ? req.file.path : null,
      creation_date: req.body.category_creation_date || "",
      updated_date: new Date(),
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("layout", {
        body: "forms/categoryForm",
        data: { category, errors: errors.array() },
      });
    } else {
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        category,
        {}
      );
      res.redirect(updatedCategory.url);
    }
  }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category delete GET");
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  await Category.findByIdAndDelete(req.params.id);
  res.redirect("/category");
});
