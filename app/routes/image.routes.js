const images = require("../controllers/image.controller.js");

module.exports = (app) => {
  //Create a new image
  app.post("/upload", images.create);

//   //Retrieve all images
//   app.get("/images", images.findAll);

  //Retrieve a single image with imageNumber
  app.get("/images/", images.findOne);

//   //Update a image with imageNumber
//   app.put("/images/:imageNumber", images.update);

//   //Delete an image with imageNumber

//   app.delete("/images/:id", images.delete);
};

// https://medium.com/@towfiqu/react-image-upload-with-cloudinary-nodejs-and-mongodb-baf23e92ba13