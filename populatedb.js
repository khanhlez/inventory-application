#! /usr/bin/env node

console.log(
  'This script populates some test categories and items to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Item = require("./models/item");

const categories = [];
const items = [];
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];
main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  await mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(
  index,
  name,
  description,
  image,
  updated_date,
  creation_date
) {
  const categoryDetail = {
    name,
    description,
    image,
    updated_date,
    creation_date,
  };

  const category = new Category(categoryDetail);
  await category.save();
  categories[index] = category;
  console.log(`Added book: ${name}`);
}

async function itemCreate(
  index,
  name,
  description,
  category,
  price,
  number_in_stock,
  image,
  updated_date,
  creation_date
) {
  const itemDetail = {
    name,
    description,
    category,
    price,
    number_in_stock,
    image,
    updated_date,
    creation_date,
  };

  const item = new Item(itemDetail);
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding Categories");
  await Promise.all([
    categoryCreate(
      0,
      "Phones",
      "Description of Phones",
      null,
      Date.now(),
      Date.now()
    ),
    categoryCreate(
      1,
      "Laptops",
      "Description of Laptops",
      null,
      Date.now(),
      Date.now()
    ),
    categoryCreate(
      2,
      "Smart Watches",
      "Description of Smart Watches",
      null,
      Date.now(),
      Date.now()
    ),
  ]);
}

async function createItems() {
  console.log("Adding items");
  await Promise.all([
    itemCreate(
      0,
      "iPhone 15",
      "Description of iPhone 15.",
      categories[0],
      10000,
      1000,
      null,
      Date.now(),
      Date.now()
    ),
    itemCreate(
      0,
      "Samsung Galaxy S24",
      "Description of Samsung Galaxy S24.",
      categories[0],
      9999,
      1000,
      null,
      Date.now(),
      Date.now()
    ),
    itemCreate(
      0,
      "Google Pixel 8",
      "Description of Google Pixel 8.",
      categories[0],
      8888,
      1000,
      null,
      Date.now(),
      Date.now()
    ),
    itemCreate(
      1,
      "MacBook Pro 2023",
      "Description of MacBook Pro 2023.",
      categories[1],
      25000,
      1500,
      null,
      Date.now(),
      Date.now()
    ),
    itemCreate(
      2,
      "Dell XPS 15",
      "Description of Dell XPS 15.",
      categories[1],
      22000,
      1400,
      null,
      Date.now(),
      Date.now()
    ),
    itemCreate(
      3,
      "HP Spectre x360",
      "Description of HP Spectre x360.",
      categories[1],
      21000,
      1300,
      null,
      Date.now(),
      Date.now()
    ),
    itemCreate(
      4,
      "Apple Watch Series 8",
      "Description of Apple Watch Series 8.",
      categories[2],
      8000,
      600,
      null,
      Date.now(),
      Date.now()
    ),
    itemCreate(
      5,
      "Samsung Galaxy Watch 5",
      "Description of Samsung Galaxy Watch 5.",
      categories[2],
      7500,
      550,
      null,
      Date.now(),
      Date.now()
    ),
    itemCreate(
      6,
      "Garmin Forerunner 955",
      "Description of Garmin Forerunner 955.",
      categories[2],
      7000,
      500,
      null,
      Date.now(),
      Date.now()
    ),
  ]);
}
