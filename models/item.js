const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, min: 3, max: 30 },
  description: { type: String, max: 90 },
  category: { type: Schema.Types.ObjectId, required: true },
  price: { type: Number, required: true },
  number_in_stock: { type: Number, required: true },
  image: { type: Buffer },
  updated_date: { type: Date },
  creation_date: { type: Date },
});

ItemSchema.virtual("url").get(function () {
  return `/item/${this._id}`;
});

ItemSchema.virtual("creation_date_formatted").get(function () {
  return DateTime.fromJSDate(this.creation_date).toFormat("yyyy-MM-dd");
});

ItemSchema.virtual("updated_date_formatted").get(function () {
  return DateTime.fromJSDate(this.updated_date).toFormat("yyyy-MM-dd");
});

module.exports = mongoose.model("Item", ItemSchema);
