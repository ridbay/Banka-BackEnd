const express = require("express");
const bodyParser = require("body-parser");

// Configuring the database
const dbConfig = require("./config/database.config.js");
const mongoose = require("mongoose");

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database", err);
    process.exit();
  });

//Remove Mongodb warning error

mongoose.set("useCreateIndex", true);

// define a simple route
app.get("/", (req, res) => {
  res.json({
    "message": "Welcome to Banka App.",
  });
});

//Require Accounts routes
let accountRoutes = require("./app/routes/account.routes");
accountRoutes(app);
//Require Users routes
let userRoutes = require("./app/routes/user.routes")

userRoutes(app);

// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
