const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dbConfig = require("./backup/database/db");

//Express APIs

const api = require("./backup/routes/auth.routes");

//Mongoose connection
mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database connected");
    },
    (error) => {
      console.log("Database can't be connected: " + error);
    }
  );

//Remove Mongodb warning error

mongoose.set("useCreateIndex", true);

//Express settings
const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

//Serve static resources
// app.use("/public/", express.static("public"));

app.use("/api", api);


//Initial Testing
app.get('/', function(req, res){
  
  res.json({"Banka React BackEnd" : "Welcome to the Banka API"});
 });

//Define PORT
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Connected to port: " + port);
});

//Express error handling
app.use((req, res, next) => {
  setImmediate(() => {
    next(new Error("Something went wrong"));
  });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
