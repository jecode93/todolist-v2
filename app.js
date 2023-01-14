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
const url = "mongodb://0.0.0.0:27017/";

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

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


//INSERTION OF MULTIPLES DOCUMENTS





app.get("/", function (req, res) {

  // const day = date.getDate();
  Item.find({}, function (err, foundItems) {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Items successfully insert");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

app.get("/:customListName", function (req, res) {
  const customListName = req.params.customListName;


  List.findOne({ name: customListName }, function (err, result) {
    if (!err) {
      if (!result) {
        //Create a new list
        const list = List({
          name: customListName,
          items: defaultItems
        });

        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show an existing list
        res.render("list", { listTitle: result.name, newListItems: result.items });
      }
    } else {

    }
  })







})

app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });


  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Items successfully deleted.");
    }
  });
  res.redirect("/");
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
