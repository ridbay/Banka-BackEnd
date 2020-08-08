const express = require('express');
const bodyParser = require('body-parser');
// const noteRoutes = require('./app/routes/note.routes.js')
// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())


mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});

//Remove Mongodb warning error

mongoose.set("useCreateIndex", true);



// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes Take notes quickly. Organize and keep track of all your notes."});
});


//Require Notes routes
require('./app/routes/note.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});