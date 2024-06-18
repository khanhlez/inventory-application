const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({})
    .sort({ updated_date: -1 })
    .exec();

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
  upload.single("category_image"),
  body("category_name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 1 })
    .withMessage("Category name must be at least 1 character long")
    .escape(),
  body("category_description")
    .trim()
    .notEmpty()
    .withMessage("Category description is required")
    .isLength({ min: 10 })
    .withMessage("Category description must be at least 10 character long")
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    let uploadedImageUrl;

    if (req.file) {
      try {
        const uploadedImage = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((error, result) =>
            error ? reject(error) : resolve(result)
          );
          stream.end(req.file.buffer);
        });
        uploadedImageUrl = uploadedImage.secure_url;
      } catch (err) {
        console.log(err);
        res.status(500).send("Error uploading image to cloudinary");
      }
    }

    const category = new Category({
      name: req.body.category_name,
      description: req.body.category_description,
      image: uploadedImageUrl ? uploadedImageUrl : null,
      creation_date: new Date(),
      updated_date: new Date(),
    });

    if (!errors.isEmpty()) {
      res.render("layout", {
        body: "forms/categoryForm",
        data: { category: {}, errors: errors.array() },
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
  upload.single("category_image"),
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
    const category = Category.findById(req.params.id);

    if (!category) {
      return res.status(404).send("Category not found");
    }

    if (!errors.isEmpty()) {
      res.render("layout", {
        body: "forms/categoryForm",
        data: { category, errors: errors.array() },
      });
      return;
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
      } catch (err) {
        console.error(err);
        res.status(500).send("Error uploading image to cloudinary");
      }
    }

    category.name = req.body.category_name;
    category.description = req.body.category_description;
    if (uploadedImageUrl) {
      category.image = uploadedImageUrl;
    }

    category.updated_date = new Date();

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      category,
      {}
    );
    res.redirect(updatedCategory.url);
  }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category delete GET");
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  await Category.findByIdAndDelete(req.params.id);
  res.redirect("/category");
});
