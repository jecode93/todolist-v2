//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



//DB Name
const database = "todolistDB";

//DB url
const url = "mongodb://localhost:27017/";

//DB connection and the database creation.
mongoose.set('strictQuery', false);
mongoose.connect(url + database, { useNewUrlParser: true });

//Creation of the items Schema
const itemsSchema = new mongoose.Schema({
  name: String
});

//Use the Schema to create the collection model of the database with the singular name 
const Item = mongoose.model("Item", itemsSchema);


//CREATION OF NEW ITEMS

const item1 = Item({
  name: "Learning."
});

const item2 = Item({
  name: "Starting a new coding project."
});

const item3 = Item({
  name: "Practice coding."
});

//ARRAY OF THE ITEMS
const defaultItems = [item1, item2, item3];


//INSERTION OF MULTIPLES DOCUMENTS
Item.insertMany(defaultItems, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Items successfully insert");
  }
  mongoose.connection.close();
})

const items = [];
const workItems = [];




app.get("/", function (req, res) {

  // const day = date.getDate();

  res.render("list", { listTitle: "Today", newListItems: items });

});

app.post("/", function (req, res) {

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
