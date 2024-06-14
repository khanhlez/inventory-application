const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true, min: 3, max: 30 },
  description: { type: String, require: true, max: 90 },
  creation_date: { type: Date },
  updated_date: { type: Date },
  image: { type: Buffer },
});

CategorySchema.virtual("url").get(function () {
  return `/category/${this._id}`;
});

CategorySchema.virtual("creation_date_formatted").get(function () {
  return DateTime.fromJSDate(this.creation_date).toFormat("yyyy-MM-dd");
});

CategorySchema.virtual("updated_date_formatted").get(function () {
  return DateTime.fromJSDate(this.updated_date).toFormat("yyyy-MM-dd");
});

module.exports = mongoose.model("Category", CategorySchema);
